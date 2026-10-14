/* Lingo Quest — family sync: codes, the Cloudflare function, merging, and
   three devices syncing through the real UI (jsdom) against the real function
   with an in-memory KV store. */
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const Babel = require('@babel/standalone');
const { test, assert, eq, run } = require('./harness');
const APP = path.join(__dirname, '../lingo-quest');
const FN = path.join(__dirname, '../functions/api/sync.js');

/* ---------- The Pages Function, loaded as plain code ---------- */
const fnSrc = fs.readFileSync(FN, 'utf8').replace('export async function onRequest', 'async function onRequest') + '\nreturn onRequest;';
const onRequest = new Function(fnSrc)();
function makeKV() {
  const m = new Map();
  return {
    map: m, writes: 0,
    async get(k, type) { const v = m.get(k); return v == null ? null : type === 'json' ? JSON.parse(v) : v; },
    async put(k, v) { this.writes++; m.set(k, v); }
  };
}
let kv = makeKV();
let netMode = 'ok'; // ok | offline | nofunction
async function callFn(method, code, body, env) {
  const init = { method, headers: { 'x-lq-key': code } };
  if (body !== undefined) { init.headers['content-type'] = 'application/json'; init.body = typeof body === 'string' ? body : JSON.stringify(body); }
  const res = await onRequest({ request: new Request('https://lingo.test/api/sync', init), env: env || { LQ_SYNC: kv } });
  return { status: res.status, body: await res.json() };
}
function fakeFetch(url, opts) {
  if (netMode === 'offline') return Promise.reject(new TypeError('Failed to fetch'));
  if (netMode === 'nofunction') return Promise.resolve(new Response('<!doctype html><html></html>', { status: 200, headers: { 'content-type': 'text/html' } }));
  const init = { method: opts.method, headers: opts.headers, body: opts.body };
  return onRequest({ request: new Request(new URL(url, 'https://lingo.test/').href, init), env: { LQ_SYNC: kv } });
}

/* ---------- Devices ---------- */
let dom, win, doc, LQ;
const devices = {};
function boot(name, savedState) {
  const d = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://lingo.test/', pretendToBeVisual: true, runScripts: 'outside-only' });
  const w = d.window;
  w.speechSynthesis = { getVoices: () => [{ lang: 'zh-CN', name: 'Tingting' }, { lang: 'es-ES', name: 'Monica' }, { lang: 'vi-VN', name: 'Linh' }, { lang: 'ar-SA', name: 'Maged' }], speak() {}, cancel() {}, addEventListener() {}, removeEventListener() {} };
  w.SpeechSynthesisUtterance = function (t) { this.text = t; };
  w.AudioContext = function () {
    const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
    const node = () => ({ connect() {}, gain: param() });
    this.state = 'running'; this.currentTime = 0; this.destination = {};
    this.createGain = node; this.createOscillator = () => Object.assign(node(), { frequency: param(), start() {}, stop() {} });
    this.createBuffer = () => ({}); this.createBufferSource = () => Object.assign(node(), { start() {} });
  };
  w.fetch = fakeFetch;
  w.crypto.getRandomValues || (w.crypto.getRandomValues = a => require('crypto').getRandomValues(a));
  if (savedState) w.localStorage.setItem('lingoQuest', JSON.stringify(savedState));
  w.eval(fs.readFileSync(path.join(__dirname, 'node_modules/react/umd/react.development.js'), 'utf8'));
  w.eval(fs.readFileSync(path.join(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'), 'utf8'));
  w.eval('window.LQ = { debug: {}, noAutoMount: true };');
  ['data/languages', 'data/worlds-3-5', 'data/pictures', 'data/pictures-3-5', 'core/tones', 'core/content', 'core/srs', 'core/storage', 'core/questions', 'core/speech', 'core/sfx', 'core/sync']
    .forEach(f => w.eval(fs.readFileSync(path.join(APP, 'js', f + '.js'), 'utf8')));
  ['ui/common', 'ui/lesson', 'ui/home', 'ui/parent', 'app'].forEach(f => w.eval(Babel.transform(fs.readFileSync(path.join(APP, 'js', f + '.jsx'), 'utf8'), { presets: ['react'] }).code));
  devices[name] = { dom: d, win: w, doc: w.document, LQ: w.LQ };
  use(name);
  w.ReactDOM.createRoot(doc.querySelector('#root')).render(w.React.createElement(LQ.App));
}
function use(name) { const d = devices[name]; dom = d.dom; win = d.win; doc = d.doc; LQ = d.LQ; }

const tick = (ms = 20) => new Promise(r => setTimeout(r, ms));
const $ = s => doc.querySelector(s);
const $$ = s => Array.from(doc.querySelectorAll(s));
function byText(text, sel = 'button') { return $$(sel).find(el => el.textContent.trim() === text) || $$(sel).find(el => el.textContent.includes(text)); }
async function click(el, label) { assert(el, 'missing element: ' + label); el.click(); await tick(30); }
async function type(el, value) {
  assert(el, 'missing input');
  const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value); el.dispatchEvent(new win.Event('input', { bubbles: true })); await tick();
}
function tab(name) { return $$('.tab').find(t => t.textContent.trim() === name); }
function state() { return JSON.parse(win.localStorage.getItem('lingoQuest')); }
function hasText(t) { return doc.body.textContent.includes(t); }
async function until(fn, label, ms = 1500) { for (let t = 0; t < ms; t += 20) { if (fn()) return; await tick(20); } throw new Error('timed out: ' + label + ' — ' + doc.body.textContent.slice(0, 240)); }
async function openSync() {
  if (!hasText('Parent area') || !tab('Sync')) {
    await click(tab('Family'), 'family tab');
    await click(byText('Parent area'), 'parent');
    const m = $('.gate-q').textContent.match(/(\d+) × (\d+)/);
    await type($('.sheet input'), String(m[1] * m[2]));
    await click(byText('Open'), 'gate open');
  }
  await click(tab('Sync'), 'sync tab');
}
const names = () => state().profiles.map(p => p.name).sort().join();

function learner(id, name, extra) {
  return Object.assign({ id, name, avatar: 'panda', colour: '#ef476f', band: 'adult', langs: ['zh'], lang: 'zh', coins: 0, stars: {}, stickers: [], srs: {}, days: [], createdAt: 1000, editedAt: 1000 }, extra || {});
}
const saved = profiles => ({ schema: 1, profiles, custom: [], removed: { p: {}, c: {} }, settings: { backupReminder: false, reminderDays: 30, lastBackup: null, sfx: false } });

/* ---------------- Codes ---------------- */
// A throwaway window just to load the client helpers for pure tests.
const pure = (() => {
  const w = new JSDOM('', { url: 'https://lingo.test/', runScripts: 'outside-only' }).window;
  w.eval('window.LQ = {};');
  ['data/languages', 'data/worlds-3-5', 'data/pictures', 'core/srs', 'core/storage', 'core/sync'].forEach(f => w.eval(fs.readFileSync(path.join(APP, 'js', f + '.js'), 'utf8')));
  return w.LQ;
})();

test('family codes: 12 easy-to-read characters, random, forgiving to type', () => {
  const seen = new Set();
  for (let i = 0; i < 200; i++) { const c = pure.sync.newCode(); assert(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/.test(c), c); seen.add(c); }
  eq(seen.size, 200, 'no repeats');
  eq(pure.sync.cleanCode(' abcd efgh jk23 '), 'ABCD-EFGH-JK23');
  eq(pure.sync.cleanCode('ABCD-EFGH-JK2'), null, 'too short');
  eq(pure.sync.cleanCode('ABCD-EFGH-JK20'), null, 'zero is not used');
  eq(pure.sync.cleanCode('ABCD-EFGH-JKI3'), null, 'I is not used');
});

/* ---------------- The Cloudflare function ---------------- */
const DATA = { app: 'lingo-quest', schema: 1, profiles: [], custom: [], removed: { p: {}, c: {} } };
test('function: rejects bad codes, says when KV is missing', async () => {
  eq((await callFn('GET', 'short')).status, 400);
  eq((await callFn('GET', 'ABCDEFGHJK20')).status, 400, 'zero not in alphabet');
  const r = await callFn('GET', 'ABCDEFGHJK23', undefined, {});
  eq(r.status, 503); eq(r.body.error, 'not-configured');
});
test('function: empty family, first save, conflicts, limits', async () => {
  const code = 'ABCDEFGHJK23';
  let r = await callFn('GET', code); eq(r.status, 200); eq(r.body.data, null); eq(r.body.rev, 0);
  r = await callFn('PUT', code, { base: 0, data: DATA }); eq(r.status, 200); eq(r.body.rev, 1);
  r = await callFn('GET', code); eq(r.body.rev, 1); eq(r.body.data.app, 'lingo-quest');
  r = await callFn('PUT', code, { base: 0, data: DATA }); eq(r.status, 409, 'stale base'); eq(r.body.rev, 1); assert(r.body.data, 'conflict returns the newer copy');
  eq((await callFn('PUT', code, { base: 1, data: { app: 'other' } })).status, 400, 'not Lingo Quest data');
  eq((await callFn('PUT', code, '{nope')).status, 400, 'bad json');
  eq((await callFn('PUT', code, { base: 1, data: Object.assign({}, DATA, { pad: 'x'.repeat(420 * 1024) }) })).status, 413, 'too big');
  eq((await callFn('DELETE', code)).status, 405);
  eq((await callFn('GET', 'abcd-efgh-jk23'.replace(/-/g, ''))).body.rev, 1, 'lower case finds the same family');
});
test('function: stores the code only as a hash', async () => {
  const keys = [...kv.map.keys()];
  assert(keys.length === 1 && /^family:[0-9a-f]{64}$/.test(keys[0]), keys.join());
  assert(![...kv.map.values()].some(v => v.includes('ABCDEFGHJK23')), 'code not stored');
  kv = makeKV();
});

/* ---------------- Merging ---------------- */
test('merge: best progress of both, newest name, deletions stick, max 4', () => {
  const S = pure.store;
  const here = S.migrate(saved([learner('a', 'Mia', { stars: { 'zh:greetings': 1, 'zh:numbers': 3 }, coins: 5, days: ['2026-10-01'], editedAt: 2000 }), learner('b', 'Leo')]));
  const there = S.syncPayload(S.migrate(saved([learner('a', 'Mia Ngo', { stars: { 'zh:greetings': 3 }, coins: 9, days: ['2026-10-02'], editedAt: 3000 }), learner('c', 'Dad', { createdAt: 500 })])));
  there.removed.p.b = 4000;
  const m = S.syncMerge(here, there).state;
  eq(m.profiles.map(p => p.name).join(), 'Dad,Mia Ngo', 'Leo deleted elsewhere, Dad added, newest name');
  const mia = m.profiles[1];
  eq(mia.stars['zh:greetings'], 3); eq(mia.stars['zh:numbers'], 3); eq(mia.coins, 9); eq(mia.days.join(), '2026-10-01,2026-10-02');
  const many = S.syncPayload(S.migrate(saved(['p', 'q', 'r', 's'].map((id, i) => learner(id, 'X' + i, { createdAt: i + 1 })))));
  const capped = S.syncMerge(S.migrate(saved([learner('z', 'Late', { createdAt: 99 })])), many);
  eq(capped.state.profiles.length, 4); eq(capped.skipped.join(), 'Late');
});
test('merge: joining matches a learner with the same name', () => {
  const S = pure.store;
  const here = S.migrate(saved([learner('local', 'mia', { stars: { 'zh:numbers': 2 } })]));
  const there = S.syncPayload(S.migrate(saved([learner('fam', 'Mia', { stars: { 'zh:greetings': 3 } })])));
  const m = S.syncMerge(here, there, { matchNames: true }).state;
  eq(m.profiles.length, 1); eq(m.profiles[0].id, 'fam'); eq(m.profiles[0].stars['zh:numbers'], 2); eq(m.profiles[0].stars['zh:greetings'], 3);
});
test('two devices syncing at the same moment both keep their progress', async () => {
  const savedFetch = globalThis.fetch;
  globalThis.fetch = fakeFetch; pure.sync && (pure.sync.__f = 1);
  const w = new JSDOM('', { url: 'https://lingo.test/', runScripts: 'outside-only' }).window;
  w.fetch = fakeFetch; w.eval('window.LQ = {};');
  ['data/languages', 'data/worlds-3-5', 'data/pictures', 'core/srs', 'core/storage', 'core/sync'].forEach(f => w.eval(fs.readFileSync(path.join(APP, 'js', f + '.js'), 'utf8')));
  const S = w.LQ.store, code = 'QQQQ-WWWW-EEEE';
  const one = S.migrate(saved([learner('m', 'Mia', { stars: { 'zh:greetings': 3 } })]));
  const two = S.migrate(saved([learner('m', 'Mia', { stars: { 'zh:numbers': 2 } })]));
  const [a, b] = await Promise.all([w.LQ.sync.syncOnce(one, code), w.LQ.sync.syncOnce(two, code)]);
  const fam = (await callFn('GET', 'QQQQWWWWEEEE')).body;
  eq(fam.data.profiles[0].stars['zh:greetings'], 3); eq(fam.data.profiles[0].stars['zh:numbers'], 2, 'both lessons kept');
  assert(a.pushed && b.pushed);
  globalThis.fetch = savedFetch; kv = makeKV();
});

/* ---------------- Three devices through the app ---------------- */
let CODE;
test('phone: start family sync shows a code and saves the family', async () => {
  boot('phone', saved([learner('mia', 'Mia', { stars: { 'zh:greetings': 3 }, stickers: ['greetings'] })]));
  await tick(900);
  eq(kv.writes, 0, 'nothing sent before sync is switched on');
  await openSync();
  assert(hasText('Start family sync') && hasText('Join with a code'));
  assert(tab('Backup') && tab('Sound'), 'all six parent tabs present');
  await click(byText('Start family sync'), 'start');
  await until(() => $('.sync-code'), 'code shown');
  CODE = $('.sync-code').textContent;
  assert(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(CODE), CODE);
  assert(hasText('Synced just now'));
  eq(kv.map.size, 1); eq(state().settings.sync.code, CODE);
  eq(JSON.parse([...kv.map.values()][0]).data.profiles[0].name, 'Mia');
  assert(!JSON.parse([...kv.map.values()][0]).data.settings, 'device settings stay on the device');
});

test('tablet with its own learner joins and combines', async () => {
  boot('tablet', saved([learner('dad', 'Dad', { createdAt: 2000 })]));
  await tick(900);
  await openSync();
  await click(byText('Join with a code'), 'join');
  await type($('.code-input'), 'wxyz-wxyz-wxyz'.replace(/[WXYZ]/gi, 'A'));
  await click(byText('Join', 'button.btn.primary'), 'join go');
  await until(() => hasText('No family found'), 'unknown code message');
  await type($('.code-input'), CODE.toLowerCase().replace(/-/g, ' '));
  assert(hasText('Keeps Dad'), 'explains combine');
  await click(byText('Join', 'button.btn.primary'), 'join go');
  await until(() => hasText('Joined'), 'joined');
  eq(names(), 'Dad,Mia'); eq(state().profiles.find(p => p.name === 'Mia').stars['zh:greetings'], 3, 'Mia\'s stars arrived');
  eq(state().settings.sync.code, CODE);
});

test('phone picks up Dad with Sync now', async () => {
  use('phone');
  await click(byText('Sync now'), 'sync now');
  await until(() => names() === 'Dad,Mia', 'Dad on phone');
});

test('new laptop joins from the welcome screen', async () => {
  boot('laptop');
  await tick(50);
  await click(byText('Join my family with a sync code'), 'welcome join');
  assert(!hasText('Learners on this device'), 'no combine choice when empty');
  await type($('.code-input'), CODE);
  await click(byText('Join', 'button.btn.primary'), 'join go');
  await until(() => hasText('Who is learning') || $$('.profile-card, .pick').length > 0 || names() === 'Dad,Mia', 'picker');
  eq(names(), 'Dad,Mia');
});

test('deleting a learner on one device removes it everywhere', async () => {
  use('phone');
  await click(tab('Learners'), 'learners');
  await click($('[aria-label="Delete Dad"]'), 'delete Dad');
  assert(hasText('removed from every synced device'), 'warning says every device');
  await click(byText('Delete', '.sheet button'), 'confirm');
  eq(names(), 'Mia');
  await click(tab('Sync'), 'sync tab');
  await click(byText('Sync now'), 'sync now');
  await until(() => hasText('Synced just now') && !$('.btn.jade').disabled, 'synced');
  use('tablet');
  await click(byText('Sync now'), 'sync now');
  await until(() => names() === 'Mia', 'Dad gone on tablet');
});

test('offline and missing setup show plain messages, then recover', async () => {
  use('tablet');
  netMode = 'offline';
  await click(byText('Sync now'), 'sync offline');
  await until(() => hasText('No internet right now'), 'offline message');
  netMode = 'nofunction';
  await click(byText('Sync now'), 'sync no function');
  await until(() => hasText('Sync is not set up on the website yet'), 'setup message');
  netMode = 'ok';
  await click(byText('Sync now'), 'sync ok');
  await until(() => hasText('Synced just now'), 'recovered');
});

test('progress made after a lesson-style change reaches the other device', async () => {
  use('laptop');
  // Simulate play on the laptop through the app's own update path: a coin earned on the home screen is not exposed,
  // so write through storage and reload the app the way a phone reopening does.
  const s = state(); s.profiles.find(p => p.name === 'Mia').stars['zh:numbers'] = 2; win.localStorage.setItem('lingoQuest', JSON.stringify(s));
  boot('laptop2', s); await tick(900); // app open triggers a sync
  await until(() => JSON.parse([...kv.map.values()][0]).data.profiles[0].stars['zh:numbers'] === 2, 'family copy updated on open');
  use('phone');
  await click(byText('Sync now'), 'phone sync');
  await until(() => state().profiles[0].stars['zh:numbers'] === 2, 'phone has the numbers stars');
});

test('stop syncing keeps learners and forgets the code', async () => {
  use('tablet');
  await click(byText('Stop syncing on this device'), 'stop');
  await click(byText('Stop syncing', '.sheet button'), 'confirm stop');
  assert(hasText('Start family sync'), 'back to the start screen');
  eq(state().settings.sync, undefined); eq(names(), 'Mia');
  const writes = kv.writes;
  await tick(100); eq(kv.writes, writes, 'no more syncing');
});

run('sync').then(f => process.exit(f ? 1 : 0));
