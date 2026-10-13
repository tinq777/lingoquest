/* Lingo Quest — plays every unit in every language for every learning style,
   and checks each screen shows what it should. */
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const Babel = require('@babel/standalone');
const { test, assert, eq, run } = require('./harness');
const APP = path.join(__dirname, '../lingo-quest');

/* Compile the app once, then reuse it for every lesson. */
const LIBS = [
  fs.readFileSync(path.join(__dirname, 'node_modules/react/umd/react.production.min.js'), 'utf8'),
  fs.readFileSync(path.join(__dirname, 'node_modules/react-dom/umd/react-dom.production.min.js'), 'utf8')
];
const PLAIN = ['data/languages', 'data/pictures', 'core/tones', 'core/content', 'core/srs', 'core/storage', 'core/questions', 'core/speech', 'core/sfx']
  .map(f => fs.readFileSync(path.join(APP, 'js', f + '.js'), 'utf8'));
const JSX = ['ui/common', 'ui/lesson', 'ui/home', 'ui/parent', 'app']
  .map(f => Babel.transform(fs.readFileSync(path.join(APP, 'js', f + '.jsx'), 'utf8'), { presets: ['react'] }).code);

let win, doc, LQ;
function boot(state) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://lingo.test/', runScripts: 'outside-only' });
  win = dom.window; doc = win.document;
  win.speechSynthesis = { getVoices: () => [{ lang: 'zh-CN', name: 'a' }, { lang: 'es-ES', name: 'b' }, { lang: 'vi-VN', name: 'c' }, { lang: 'ar-SA', name: 'd' }], speak() {}, cancel() {}, addEventListener() {}, removeEventListener() {} };
  win.SpeechSynthesisUtterance = function (t) { this.text = t; };
  win.localStorage.setItem('lingoQuest', JSON.stringify(state));
  LIBS.forEach(src => win.eval(src));
  win.eval('window.LQ = { debug: {}, noAutoMount: true };');
  PLAIN.concat(JSX).forEach(src => win.eval(src));
  LQ = win.LQ;
  win.ReactDOM.createRoot(doc.getElementById('root')).render(win.React.createElement(LQ.App));
}
const tick = (ms = 5) => new Promise(r => setTimeout(r, ms));
const $ = s => doc.querySelector(s);
const $$ = s => Array.from(doc.querySelectorAll(s));
async function click(el, what) { assert(el, 'missing: ' + what); el.click(); await tick(); }
const step = () => ($('.step-name') || {}).textContent;

/* Check the screen in front of us; throw with a clear message if it is wrong. */
function checkScreen(band, where) {
  const s = step(), q = LQ.debug.q;
  const fail = m => { throw new Error(where + ' ' + s + (q ? ' ' + q.kind + ' ' + q.word.key : '') + ': ' + m); };
  if (s === 'Learn') {
    if (!$('.learn-pic svg')) fail('no picture');
    const en = $('.learn-card .en'); if (!en || !en.textContent.trim()) fail('no English word');
    if (band === 'pre' && $('.learn-card .word')) fail('pre-reader sees written word');
    if (band !== 'pre' && !$('.learn-card .word')) fail('no written word');
    if (band !== 'pre' && where.split('/')[1] === 'ar' && (!$('.learn-card .ar[dir=rtl]') || !$('.learn-card .translit'))) fail('Arabic not right-to-left with spelling');
    if (band === 'pre' && $('[aria-label="Say it"]')) fail('mic shown to pre-reader');
  }
  if (s === 'Practise' || s === 'Checkpoint') {
    if (q.kind === 'listen-type') {
      if (s === 'Practise') fail('typing game on brand-new words');
      if (!$('input[aria-label="Your answer"]')) fail('no answer box');
      if (!$$('button').some(b => b.textContent === 'Hint')) fail('no Hint button');
      return;
    }
    const opts = $$('[data-key]');
    if (opts.length < 2) fail('only ' + opts.length + ' options');
    if (!opts.some(o => o.dataset.key === q.answer)) fail('answer not offered');
    opts.forEach(o => { if (!o.textContent.trim() && !o.querySelector('svg')) fail('empty option'); });
    if (['listen-pic', 'word-pic'].includes(q.kind)) opts.forEach(o => {
      if (!o.querySelector('svg')) fail('picture option without picture');
      const l = o.querySelector('.opt-label'); if (!l || !l.textContent.trim()) fail('picture option without English label');
    });
    if (q.kind === 'pic-sound' && !$('.prompt .en')) fail('no English under the picture');
    if (band === 'pre' && !['listen-pic', 'pic-sound'].includes(q.kind)) fail('reading question for pre-reader');
  }
  if (s === 'Chat') {
    const bubbles = $$('.bubble');
    if (!bubbles.length) fail('no chat bubbles');
    bubbles.forEach(b => { if (!b.textContent.trim()) fail('chat bubble with no words'); });
  }
  if (s === 'Tip') { const t = $('.tip-body'); if (!t || t.textContent.trim().length < 20) fail('empty tip'); if (band === 'pre') fail('tip shown to pre-reader'); }
}

async function playUnit(band, lang, unitIndex) {
  const units = (LQ || { UNITS: null }).UNITS;
  const prof = { id: 'p', name: 'Tester', avatar: 'cat', colour: '#8a6fd1', band, langs: [lang], lang, coins: 0, stars: {}, stickers: [], srs: {}, days: [], createdAt: Date.now() };
  boot({ schema: 1, custom: [], settings: { backupReminder: false, reminderDays: 30, lastBackup: Date.now() }, profiles: [prof] });
  await tick(20);
  const unit = LQ.UNITS[unitIndex];
  // Unlock everything before this unit, then reload so the map reflects it.
  const s = JSON.parse(win.localStorage.getItem('lingoQuest'));
  LQ.UNITS.slice(0, unitIndex).forEach(u => { s.profiles[0].stars[lang + ':' + u.id] = 3; });
  boot(s); await tick(20);
  const where = band + '/' + lang + '/' + unit.id;
  const world = LQ.worldOf(unit.id);
  await click($$('.worlds button').find(b => b.textContent.includes(world.title)), 'world ' + world.title);
  await click($$('.stone').find(x => x.textContent.includes(unit.title)), 'unit ' + unit.title);
  const kinds = new Set(), steps = new Set(), explained = new Set();
  for (let guard = 0; guard < 160; guard++) {
    if (doc.body.textContent.includes('Back to the map')) break;
    const st = step(); if (!st) throw new Error(where + ': blank screen (no step, no result)');
    steps.add(st);
    const intro = $('[data-intro]');
    if (intro) {
      const kind = intro.dataset.intro;
      if (!$('.intro-body h1') || !$('.intro-body h1').textContent.trim()) throw new Error(where + ': intro ' + kind + ' has no title');
      if (kind === 'unit') { if ($$('.intro-steps li').length < 4) throw new Error(where + ': start screen missing steps'); }
      else {
        if (!$('.intro-text') || $('.intro-text').textContent.trim().length < 20) throw new Error(where + ': intro ' + kind + ' has no explanation');
        if (!$('.demo')) throw new Error(where + ': intro ' + kind + ' has no picture of the game');
      }
      explained.add(kind);
      await click($('.intro-go'), 'intro go'); continue;
    }
    checkScreen(band, where);
    if ((st === 'Practise' || st === 'Checkpoint') && LQ.debug.q && !explained.has(LQ.debug.q.kind)) throw new Error(where + ': game ' + LQ.debug.q.kind + ' started without being explained');
    if (st === 'Chat' && !explained.has('chat')) throw new Error(where + ': chat started without being explained');
    if (st === 'Checkpoint' && !explained.has('check')) throw new Error(where + ': checkpoint started without being explained');
    if (st === 'Learn') { await click($('.btn.primary.grow'), 'learn next'); continue; }
    if (st === 'Tip') { await click($$('button').find(b => b.textContent === 'Next'), 'tip next'); continue; }
    if (st === 'Chat') {
      if ($('.replies')) {
        const want = LQ.LANGUAGES[lang].dialogues[unit.id][1].t;
        await click($$('.reply').find(r => r.querySelector('.t').textContent === want), 'right reply');
      } else await click($('.btn.primary.block'), 'chat next');
      continue;
    }
    const q = LQ.debug.q; kinds.add(q.kind);
    if (q.kind === 'listen-type') {
      const i = $('input[aria-label="Your answer"]');
      Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(i, q.word.t);
      i.dispatchEvent(new win.Event('input', { bubbles: true })); await tick();
      await click($$('button').find(b => b.textContent === 'Check'), 'check');
    } else {
      await click($$('[data-key]').find(o => o.dataset.key === q.answer), 'answer');
      if (q.kind === 'pic-sound') await click($('[aria-label="Choose this sound"]'), 'tick');
    }
    const fbw = $('.fb-word'); if (!fbw || !fbw.textContent.includes(q.word.en)) throw new Error(where + ': feedback does not show the word');
    await click($$('.feedback button').find(b => b.textContent === 'Next'), 'next');
  }
  assert(doc.body.textContent.includes('Back to the map'), where + ': lesson did not finish');
  eq(JSON.parse(win.localStorage.getItem('lingoQuest')).profiles[0].stars[lang + ':' + unit.id], 3, where + ' stars');
  if (!explained.has('unit')) throw new Error(where + ': no start screen');
  const want = band === 'pre' ? ['Start', 'Learn', 'Practise', 'Chat', 'Checkpoint'] : ['Start', 'Learn', 'Practise', 'Tip', 'Chat', 'Checkpoint'];
  eq([...steps].join(), want.join(), where + ' steps');
  return kinds;
}

const UNIT_COUNT = 10;
for (const band of ['pre', 'early', 'adult']) for (const lang of ['zh', 'es', 'vi', 'ar']) {
  test(`${band} · ${lang}: all ${UNIT_COUNT} units play through with every screen filled`, async () => {
    for (let i = 0; i < UNIT_COUNT; i++) await playUnit(band, lang, i);
    eq(LQ.UNITS.length, UNIT_COUNT, 'unit count changed: update UNIT_COUNT');
  });
}
test('pre-reader grown-up hint shows the English word and costs a star', async () => {
  const prof = { id: 'p', name: 'Kid', avatar: 'frog', colour: '#2bb673', band: 'pre', langs: ['zh'], lang: 'zh', coins: 0, stars: {}, stickers: [], srs: {}, days: [], createdAt: Date.now() };
  boot({ schema: 1, custom: [], settings: { backupReminder: false, reminderDays: 30, lastBackup: Date.now() }, profiles: [prof] });
  await tick(20);
  await click($$('.stone')[0], 'unit 1');
  await click($('.intro-go'), 'start');
  for (let i = 0; i < 8; i++) await click($('.btn.primary.grow'), 'learn');
  if ($('.intro-go')) await click($('.intro-go'), 'game intro');
  for (let guard = 0; guard < 10 && LQ.debug.q.kind !== 'listen-pic'; guard++) {
    if ($('.intro-go')) { await click($('.intro-go'), 'game intro'); continue; }
    await click($$('[data-key]').find(o => o.dataset.key === LQ.debug.q.answer), 'skip');
    const t = $('[aria-label="Choose this sound"]'); if (t) await click(t, 'tick');
    await click($$('.feedback button').find(b => b.textContent === 'Next'), 'next');
    if ($('.intro-go')) await click($('.intro-go'), 'game intro');
  }
  eq(LQ.debug.q.kind, 'listen-pic');
  await click($$('button').find(b => b.textContent === 'Hint for grown-ups'), 'hint');
  assert($('.hint-line').textContent.includes(LQ.debug.q.word.en), 'hint names the word');
  assert(!$$('button').find(b => b.textContent === 'Hint for grown-ups'), 'hint button gone');
  const before = JSON.parse(win.localStorage.getItem('lingoQuest')).profiles[0].srs;
  await click($$('[data-key]').find(o => o.dataset.key === LQ.debug.q.answer), 'answer');
  const after = JSON.parse(win.localStorage.getItem('lingoQuest')).profiles[0].srs.zh[LQ.debug.q.word.id];
  eq(after.wrong >= 1, true, 'hinted answer is not a first-try');
});

run('every unit').then(f => process.exit(f ? 1 : 0));
