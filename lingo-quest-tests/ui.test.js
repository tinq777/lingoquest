/* Lingo Quest — jsdom integration tests: real components, real flows. */
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const Babel = require('@babel/standalone');
const { test, assert, eq, run } = require('./harness');
const APP = path.join(__dirname, '../lingo-quest');

let dom, win, doc, LQ, spoken, downloads;
function boot(savedState) {
  dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://lingo.test/', pretendToBeVisual: true, runScripts: 'outside-only' });
  win = dom.window; doc = win.document;
  spoken = []; downloads = [];
  win.speechSynthesis = {
    getVoices: () => [{ lang: 'zh-CN', name: 'Tingting' }, { lang: 'es-ES', name: 'Monica' }, { lang: 'vi-VN', name: 'Linh' }],
    speak: u => spoken.push(u.text), cancel() {}, addEventListener() {}, removeEventListener() {}
  };
  win.SpeechSynthesisUtterance = function (t) { this.text = t; };
  win.URL.createObjectURL = () => 'blob:x'; win.URL.revokeObjectURL = () => {};
  win.HTMLAnchorElement.prototype.click = function () { downloads.push(this.download); };

  if (savedState) win.localStorage.setItem('lingoQuest', JSON.stringify(savedState));
  win.eval(fs.readFileSync(path.join(__dirname, 'node_modules/react/umd/react.development.js'), 'utf8'));
  win.eval(fs.readFileSync(path.join(__dirname, 'node_modules/react-dom/umd/react-dom.development.js'), 'utf8'));
  win.eval('window.LQ = { debug: {}, noAutoMount: true };');
  ['data/languages', 'data/pictures', 'core/tones', 'core/content', 'core/srs', 'core/storage', 'core/questions', 'core/speech']
    .forEach(f => win.eval(fs.readFileSync(path.join(APP, 'js', f + '.js'), 'utf8')));
  ['ui/common', 'ui/lesson', 'ui/home', 'ui/parent', 'app'].forEach(f => {
    const src = fs.readFileSync(path.join(APP, 'js', f + '.jsx'), 'utf8');
    win.eval(Babel.transform(src, { presets: ['react'] }).code);
  });
  LQ = win.LQ;
}
const tick = (ms = 20) => new Promise(r => setTimeout(r, ms));
const $ = s => doc.querySelector(s);
const $$ = s => Array.from(doc.querySelectorAll(s));
function byText(text, sel = 'button') {
  return $$(sel).find(el => el.textContent.trim() === text) || $$(sel).find(el => el.textContent.includes(text));
}
async function click(el, label) { assert(el, 'missing element: ' + label); el.click(); await tick(); }
async function type(el, value) {
  const setter = Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value); el.dispatchEvent(new win.Event('input', { bubbles: true })); await tick();
}
function tab(name) { return $$('.tab').find(t => t.textContent.trim() === name); }
function state() { return JSON.parse(win.localStorage.getItem('lingoQuest')); }
function hasText(t) { return doc.body.textContent.includes(t); }

async function createLearner(name, band, langs) {
  await type($('input.input'), name);
  await click(byText(LQ.BANDS[band].label), 'band');
  if (langs) for (const l of langs) await click(byText(LQ.LANGUAGES[l].name), 'lang ' + l);
  await click(byText('Add learner'), 'save');
}

/* Answer the current question; wrongFirst tries a wrong option first. */
async function answer(wrongFirst) {
  const q = LQ.debug.q;
  if (q.kind === 'listen-type') {
    if (wrongFirst) { await type($('input[aria-label="Your answer"]'), 'zzz'); await click(byText('Check'), 'check'); }
    await type($('input[aria-label="Your answer"]'), q.word.t);
    await click(byText('Check'), 'check');
  } else {
    const opts = $$('[data-key]');
    if (wrongFirst) {
      const bad = opts.find(o => o.dataset.key !== q.answer);
      if (q.kind === 'pic-sound') { await click(bad, 'bad'); await click($('[aria-label="Choose this sound"]'), 'tick'); }
      else await click(bad, 'bad');
    }
    const good = opts.find(o => o.dataset.key === q.answer);
    await click(good, 'answer ' + q.kind);
    if (q.kind === 'pic-sound') await click($('[aria-label="Choose this sound"]'), 'tick');
  }
  await click($$('.feedback button').find(b => b.textContent === 'Next'), 'next after ' + q.kind);
}

async function playLesson(opts = {}) {
  for (let guard = 0; guard < 80; guard++) {
    const step = $('.step-name') ? $('.step-name').textContent : null;
    if (hasText('Back to the map')) return;
    if (step === 'Learn') { await click($('.btn.primary.grow'), 'learn next'); continue; }
    if (step === 'Practise' || step === 'Checkpoint') { await answer(opts.wrongFirst && step === 'Checkpoint'); continue; }
    if (step === 'Tip') { await click(byText('Next'), 'tip next'); continue; }
    if (step === 'Chat') {
      if ($('.replies')) {
        const want = LQ.LANGUAGES[opts.lang || 'zh'].dialogues[opts.unit || 'greetings'][1].t;
        const replies = $$('.reply');
        if (opts.wrongFirst) await click(replies.find(r => !r.querySelector('.t').textContent.includes(want)), 'wrong reply');
        await click(replies.find(r => r.querySelector('.t').textContent === want), 'reply');
      } else await click($('.btn.primary.block'), 'chat next');
      continue;
    }
    throw new Error('stuck: ' + doc.body.textContent.slice(0, 200));
  }
  throw new Error('lesson did not finish');
}

async function passGate() {
  const m = $('.gate-q').textContent.match(/(\d+) × (\d+)/);
  await type($('.sheet input'), String(m[1] * m[2]));
  await click(byText('Open'), 'gate open');
}

/* ---------------- Tests ---------------- */
test('first run shows the welcome screen', async () => {
  boot(); win.ReactDOM.createRoot($('#root')).render(win.React.createElement(LQ.App)); await tick(50);
  assert(hasText('Lingo Quest') && hasText('Set up the first learner'));
});

test('create the first learner (adult) — goes straight to a Chinese map', async () => {
  await click(byText('Set up the first learner'), 'start');
  assert(hasText('New learner'));
  assert(byText('Add learner').disabled, 'save disabled without a name');
  await createLearner('Tim', 'adult');
  const s = state(); eq(s.profiles.length, 1); eq(s.profiles[0].langs.join(), 'zh'); eq(s.profiles[0].lang, 'zh');
  eq($$('.stone').length, 5); assert(!$$('.stone')[0].disabled); assert($$('.stone')[1].disabled, 'unit 2 locked');
  assert($$('.chip.on')[0].textContent.includes('Chinese'));
});

test('adult plays unit 1 end to end: stars, coins, sticker, unlock', async () => {
  await click($$('.stone')[0], 'unit 1');
  eq($('.step-name').textContent, 'Learn');
  assert(spoken.length >= 0);
  await playLesson({ wrongFirst: true });
  assert(hasText('New sticker: Greetings'));
  const p = state().profiles[0];
  assert(p.stars['zh:greetings'] >= 1 && p.stars['zh:greetings'] <= 3, 'stars saved');
  assert(p.stars['zh:greetings'] < 3, 'wrong-first answers lower the stars');
  assert(p.coins > 0); eq(p.stickers.join(), 'zh:greetings');
  assert(Object.keys(p.srs.zh).length >= 5, 'srs recorded');
  eq(p.days.length, 1, 'practice day recorded');
  await click(byText('Back to the map'), 'back');
  assert(!$$('.stone')[1].disabled, 'unit 2 unlocked');
});

test('replaying a unit keeps the best stars and gives no second sticker', async () => {
  const before = state().profiles[0].stars['zh:greetings'];
  await click($$('.stone')[0], 'unit 1 again');
  await playLesson();
  assert(!hasText('New sticker'));
  const p = state().profiles[0];
  eq(p.stars['zh:greetings'], 3); assert(p.stars['zh:greetings'] >= before); eq(p.stickers.length, 1);
  await click(byText('Back to the map'), 'back');
});

test('leaving a lesson early returns to the map', async () => {
  await click($$('.stone')[1], 'unit 2');
  await click($('[aria-label="Leave"]'), 'leave');
  eq($$('.stone').length, 5);
});

test('review tab runs a review of learned words', async () => {
  await click(tab('Review'), 'review tab');
  assert(hasText('Daily review'));
  await click($$('.btn.primary.block')[0], 'start review');
  let n = 0;
  while (!hasText('Review done!') && n++ < 20) await answer(false);
  assert(hasText('Review done!'));
  await click(byText('Done'), 'done');
  assert(hasText('Daily review'));
});

test('add Vietnamese from the map and switch languages; progress is kept per language', async () => {
  await click(tab('Map'), 'map tab');
  await click($('[aria-label="Add a language"]'), 'add lang');
  await click(byText('Vietnamese'), 'pick vi');
  const p = state().profiles[0];
  eq(p.langs.join(), 'zh,vi'); eq(p.lang, 'vi');
  assert($$('.stone')[1].disabled, 'vi unit 2 locked');
  await click($$('.stone')[0], 'vi unit 1');
  await playLesson({ lang: 'vi', unit: 'greetings' });
  await click(byText('Back to the map'), 'back');
  assert(state().profiles[0].stars['vi:greetings'] > 0);
  await click($$('.chip').find(c => c.textContent.includes('Chinese')), 'switch zh');
  eq(state().profiles[0].lang, 'zh'); assert(!$$('.stone')[1].disabled, 'zh progress kept');
});

test('sticker book shows earned stickers', async () => {
  await click(tab('Stickers'), 'stickers tab');
  eq($$('.slot').length, 10, 'two worlds of five for one language');
  eq($$('.slot:not(.empty)').length, 1, 'Chinese sticker');
  await click($$('.seg button').find(b => b.textContent === 'Vietnamese'), 'vi stickers');
  eq($$('.slot:not(.empty)').length, 1, 'Vietnamese sticker');
  await click($$('.seg button').find(b => b.textContent === 'Spanish'), 'es stickers');
  eq($$('.slot:not(.empty)').length, 0, 'no Spanish yet');
  assert(hasText('2 / 30'));
});

test('parent gate blocks a wrong answer and opens on the right one', async () => {
  await click(tab('Family'), 'family tab');
  assert(hasText('Word of the day'));
  await click(byText('Parent area'), 'parent');
  await type($('.sheet input'), '1');
  await click(byText('Open'), 'wrong');
  assert(hasText('Not quite'));
  await passGate();
  assert(hasText('Parent area') && hasText('Learners'));
});

test('parent adds three more learners, then the 4-learner limit hides Add', async () => {
  await click(byText('Add learner'), 'add');
  await createLearner('Mia', 'early', ['es']);
  await click(byText('Add learner'), 'add 2');
  await createLearner('Leo', 'pre');
  await click(byText('Add learner'), 'add 3');
  await createLearner('Nana', 'adult');
  const s = state(); eq(s.profiles.length, 4);
  eq(s.profiles[1].langs.join(), 'zh,es', 'Chinese stays first, Spanish added'); eq(s.profiles[2].band, 'pre');
  assert(!byText('Add learner'), 'no add at 4');
  assert(hasText('4 of 4 learners'));
});

test('parent edits a learner', async () => {
  await click($('[aria-label="Edit Nana"]'), 'edit');
  const input = $('input.input'); eq(input.value, 'Nana');
  await type(input, 'Grandma');
  await click(byText('Save changes'), 'save');
  eq(state().profiles[3].name, 'Grandma');
});

test('parent adds and deletes a custom word', async () => {
  await click(tab('Words'), 'words tab');
  await type($('input[aria-label="English"]'), 'dumpling');
  await type($('input[aria-label="Chinese word"]'), '饺子');
  assert(byText('Add word').disabled, 'needs pinyin');
  await type($('input[aria-label="Pinyin"]'), 'jiǎo zi');
  await click(byText('Add word'), 'add word');
  eq(state().custom.length, 1); eq(state().custom[0].unit, 'greetings');
  assert(hasText('饺子'));
  await type($('input[aria-label="English"]'), 'cheese');
  await click(byText('Spanish'), 'es');
  await type($('input[aria-label="Spanish word"]'), 'el queso');
  await click(byText('Add word'), 'add es');
  eq(state().custom.length, 2);
  await click($('[aria-label="Delete cheese"]'), 'delete');
  eq(state().custom.length, 1);
});

test('this week shows a row per learner', async () => {
  await click(tab('This week'), 'week tab');
  eq($$('.week .nm').length, 4); assert($$('.week i.on').length >= 1);
});

test('backup: export saves a dated file and records the date', async () => {
  await click(tab('Backup'), 'backup tab');
  assert(hasText('Last full backup: never'));
  await click(byText('Export'), 'export');
  await tick(30);
  assert(/^lingo-quest-backup-\d{4}-\d{2}-\d{2}\.json$/.test(downloads[0]), downloads[0]);
  assert(state().settings.lastBackup > 0); assert(!hasText('Last full backup: never'));
});

test('backup: reminder setting toggles', async () => {
  await click(byText('Off'), 'off'); eq(state().settings.backupReminder, false);
  await click(byText('14 days'), '14'); eq(state().settings.backupReminder, true); eq(state().settings.reminderDays, 14);
});

test('backup: voices list shows each language', async () => {
  assert(hasText('Tingting') && hasText('Monica') && hasText('Linh'));
});

test('backup: restore preview, merge, and replace', async () => {
  const s = state();
  const backup = LQ.store.exportData(s);
  backup.profiles = [JSON.parse(JSON.stringify(s.profiles[0]))];
  backup.profiles[0].coins = 9999;
  const input = $$('input[type=file]').find(i => i.getAttribute('aria-label') === 'Backup file' && i.closest('.screen'));
  const file = new win.File([JSON.stringify(backup)], 'b.json', { type: 'application/json' });
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  await tick(80);
  assert(hasText('Restore this backup?'));
  await click(byText('Merge'), 'merge');
  eq(state().profiles.length, 4); eq(state().profiles[0].coins, 9999);
  assert(hasText('Updated Tim'));
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  await tick(80);
  await click(byText('Replace'), 'replace');
  assert(hasText('wipes everyone'));
  await click(byText('Replace everything'), 'confirm replace');
  eq(state().profiles.length, 1); eq(state().profiles[0].name, 'Tim');
});

test('backup: a non-backup file shows a clear error', async () => {
  const input = $$('input[type=file]').find(i => i.closest('.screen'));
  Object.defineProperty(input, 'files', { value: [new win.File(['hello'], 'x.txt')], configurable: true });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  await tick(80);
  assert(hasText('That file is not a Lingo Quest backup.'));
});

test('closing the parent area returns to the family tab', async () => {
  await click($('[aria-label="Close parent area"]'), 'close');
  assert(hasText('Word of the day'));
});

test('switch learner goes to the picker', async () => {
  await click($('[aria-label="Switch learner"]'), 'switch');
  assert(hasText("Who's playing?"));
});

test('adding from the picker needs the parent gate', async () => {
  await click(byText('Add learner'), 'add tile');
  assert(hasText('Grown-ups only'));
  await passGate();
  await createLearner('Leo', 'pre');
  eq(state().profiles.length, 2);
  assert($$('.stone').length === 5, 'new learner lands on their map');
});

test('pre-reader lesson: no text on cards, only picture and sound questions, no tip step', async () => {
  await click($$('.stone')[0], 'unit 1');
  assert(!$('.learn-card .word'), 'no written word for pre-readers');
  const kinds = new Set(), steps = new Set();
  for (let guard = 0; guard < 60 && !hasText('Back to the map'); guard++) {
    const step = $('.step-name').textContent; steps.add(step);
    if (step === 'Learn') { await click($('.btn.primary.grow'), 'next'); continue; }
    if (step === 'Chat') { assert(!$('.replies'), 'pre-readers just listen'); assert(!$('.bubble .t'), 'no text bubbles'); await click($('.btn.primary.block'), 'chat'); continue; }
    kinds.add(LQ.debug.q.kind); await answer(false);
  }
  assert(hasText('Back to the map'));
  assert(!steps.has('Tip'), 'tip skipped');
  [...kinds].forEach(k => assert(['listen-pic', 'pic-sound'].includes(k), 'kind ' + k));
  await click(byText('Back to the map'), 'back');
});

test('early reader sees pinyin on Chinese words and a character hint', async () => {
  // Make an early-reader profile directly and jump to numbers.
  const s = state();
  const kid = LQ.store.newProfile({ name: 'Mia', band: 'early', langs: ['zh'] });
  kid.stars['zh:greetings'] = 2;
  s.profiles.push(kid);
  boot(s); win.ReactDOM.createRoot($('#root')).render(win.React.createElement(LQ.App)); await tick(50);
  await click($$('.who-card').find(c => c.textContent.includes('Mia')), 'pick Mia');
  await click($$('.stone')[1], 'numbers');
  assert($('.learn-card ruby rt'), 'pinyin above characters');
  eq($('.learn-card rt').textContent, 'yī'); assert(hasText('One line'), 'character hint');
  await click($('[aria-label="Leave"]'), 'leave');
});

test('mastered words hide pinyin until tapped', async () => {
  const s = state(); const mia = s.profiles.find(p => p.name === 'Mia');
  mia.srs.zh = { hello: { box: 5, due: 0, seen: 5, right: 5, wrong: 0, last: 0 } };
  const w = LQ.content.wordByKey('zh:hello', []);
  const host = doc.createElement('div'); doc.body.appendChild(host);
  win.ReactDOM.createRoot(host).render(win.React.createElement(LQ.ui.WordText, { word: w, mastered: true }));
  await tick();
  assert(host.querySelector('rt.hide'), 'hidden');
  await click(host.querySelector('.word'), 'tap');
  assert(!host.querySelector('rt.hide'), 'revealed on tap');
  host.remove();
});

test('family: play together with two learners', async () => {
  await click($('[aria-label="Switch learner"]'), 'switch');
  await click($$('.who-card').find(c => c.textContent.includes('Tim')), 'Tim');
  await click(tab('Family'), 'family');
  await click(byText('Play together'), 'coop');
  assert(hasText('Take turns'));
  await click($$('.sheet .choice').find(c => c.textContent.includes('Leo')), 'drop Leo');
  await click(byText('Start'), 'start');
  let n = 0;
  while (!hasText('Great teamwork!') && n++ < 30) {
    assert(/'s turn/.test(doc.body.textContent), 'turn banner');
    await answer(false);
  }
  assert(hasText('Great teamwork!'));
  const s = state();
  eq(s.profiles.find(p => p.name === 'Leo').days.length, 1, 'Leo did not play this round, keeps his earlier day');
  assert(s.profiles.find(p => p.name === 'Mia').days.length === 1, 'Mia practised');
  await click(byText('Done'), 'done');
  assert(hasText('Family streak'));
});

test('voice warning appears once when a language has no voice', async () => {
  const s = state();
  boot(s);
  win.speechSynthesis.getVoices = () => [{ lang: 'zh-CN', name: 'Tingting' }];
  win.ReactDOM.createRoot($('#root')).render(win.React.createElement(LQ.App)); await tick(50);
  await click($$('.who-card').find(c => c.textContent.includes('Tim')), 'Tim');
  await tick(1700);
  assert(hasText('A voice is missing') && hasText('Vietnamese'));
  await click(byText('OK'), 'ok');
  assert(!hasText('A voice is missing'));
});

test('storage blocked: the app still runs in memory', async () => {
  boot();
  Object.defineProperty(win, 'localStorage', { get() { throw new Error('blocked'); } });
  win.ReactDOM.createRoot($('#root')).render(win.React.createElement(LQ.App)); await tick(50);
  await click(byText('Set up the first learner'), 'start');
  await createLearner('Solo', 'adult');
  eq($$('.stone').length, 5);
});


test('review leans about 70/30 towards Chinese when several languages are on', async () => {
  const p = LQ.store.newProfile({ name: 'R', band: 'adult', langs: ['zh', 'vi'] });
  const now = Date.now();
  ['hello', 'thanks', 'sorry', 'one', 'two'].forEach(id => { (p.srs.zh = p.srs.zh || {})[id] = { box: 1, due: now - 1, seen: 1, right: 0, wrong: 1, last: 0 }; (p.srs.vi = p.srs.vi || {})[id] = { box: 1, due: now - 1, seen: 1, right: 0, wrong: 1, last: 0 }; });
  let zh = 0, total = 0;
  for (let i = 0; i < 60; i++) { const qs = LQ.buildReview(p, []); total += qs.length; zh += qs.filter(q => q.lang === 'zh').length; eq(qs.length, 8); }
  const share = zh / total; assert(share > 0.6 && share < 0.8, 'zh share ' + share);
  const solo = LQ.store.newProfile({ name: 'S', band: 'pre' }); eq(LQ.buildReview(solo, []).length, 0, 'nothing learned yet');
});

test('restoring a bad file on the welcome screen shows an error in the page', async () => {
  boot(); win.ReactDOM.createRoot($('#root')).render(win.React.createElement(LQ.App)); await tick(50);
  const input = $$('input[type=file]')[0];
  Object.defineProperty(input, 'files', { value: [new win.File(['nope'], 'x.json')], configurable: true });
  input.dispatchEvent(new win.Event('change', { bubbles: true })); await tick(80);
  assert(hasText('That file is not a Lingo Quest backup.'));
});

test('worlds: finishing world 1 opens world 2 on the map, and either world can be viewed', async () => {
  const s = state() || { schema: 1, profiles: [], custom: [], settings: { backupReminder: true, reminderDays: 30, lastBackup: null } };
  const w = LQ.store.newProfile({ name: 'Wren', band: 'adult', langs: ['zh'] });
  ['greetings', 'numbers', 'colours', 'family', 'food'].forEach(u => { w.stars['zh:' + u] = 3; });
  s.profiles = [w];
  boot(s); win.ReactDOM.createRoot($('#root')).render(win.React.createElement(LQ.App)); await tick(50);
  assert($('.worlds button.on').textContent.includes('My world'), 'opens on world 2');
  const titles = $$('.stone .label').map(l => l.textContent);
  assert(titles[0].includes('Animals') && titles[4].includes('Weather'), titles.join('|'));
  assert(!$$('.stone')[0].disabled && $$('.stone')[1].disabled, 'Animals open, Body locked');
  await click($$('.worlds button').find(b => b.textContent.includes('First words')), 'world 1');
  eq($$('.stone.done').length, 5); assert($('.worlds button.on').textContent.includes('15/15'));
  await click($$('.worlds button').find(b => b.textContent.includes('My world')), 'world 2');
  await click($$('.stone')[0], 'animals');
  assert($('.learn-card'), 'animals lesson starts');
  await playLesson({ lang: 'zh', unit: 'animals' });
  await click(byText('Back to the map'), 'back');
  assert($('.worlds button.on').textContent.includes('My world'), 'back on world 2');
  assert(!$$('.stone')[1].disabled, 'Body unlocked');
});

run('ui').then(f => process.exit(f ? 1 : 0));
