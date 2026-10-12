/* Lingo Quest — content integrity and core logic tests (Node, no DOM). */
const { test, assert, eq, run } = require('./harness');
const store = {};
globalThis.window = { localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
globalThis.LQ = window.LQ = {};
const ROOT = '../lingo-quest/js/';
['data/languages', 'data/pictures', 'core/tones', 'core/content', 'core/srs', 'core/storage', 'core/questions'].forEach(f => {
  const src = require('fs').readFileSync(require('path').join(__dirname, ROOT + f + '.js'), 'utf8');
  new Function('window', 'globalThis', src)(window, globalThis);
});
const LQ = window.LQ;
let seed = 7; const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const LANGS = Object.keys(LQ.LANGUAGES);

/* ---------- Content integrity ---------- */
test('three languages registered, Chinese is the default', () => {
  eq(LANGS.sort().join(), 'es,vi,zh'); eq(LQ.defaultLang(), 'zh'); eq(LQ.langList()[0].id, 'zh');
});
test('10 units with 8 unique concepts each, unique ids across units', () => {
  eq(LQ.UNITS.length, 10);
  const ids = new Set();
  LQ.UNITS.forEach(u => { eq(u.concepts.length, 8, u.id); u.concepts.forEach(c => { assert(!ids.has(c.id), 'dup ' + c.id); ids.add(c.id); }); });
});
test('every unit sits in exactly one world of five, in map order', () => {
  const seen = [];
  LQ.WORLDS.forEach(w => { eq(w.units.length, 5, w.id); w.units.forEach(u => { assert(LQ.unitById(u), 'unknown unit ' + u); seen.push(u); }); });
  eq(seen.join(), LQ.UNITS.map(u => u.id).join(), 'worlds follow unit order');
  eq(LQ.worldOf('animals').id, 'w2');
});
test('every concept has a word in every language', () => {
  LANGS.forEach(l => LQ.UNITS.forEach(u => u.concepts.forEach(c => assert(LQ.LANGUAGES[l].words[c.id] && LQ.LANGUAGES[l].words[c.id].t, l + ':' + c.id))));
});
test('no stray words outside the units', () => {
  const ids = new Set(); LQ.UNITS.forEach(u => u.concepts.forEach(c => ids.add(c.id)));
  LANGS.forEach(l => Object.keys(LQ.LANGUAGES[l].words).forEach(id => assert(ids.has(id), l + ' has stray ' + id)));
});
test('every concept and unit emblem has a picture', () => {
  LQ.UNITS.forEach(u => { assert(LQ.PICTURES[u.emblem], 'emblem ' + u.emblem); u.concepts.forEach(c => assert(/^<svg/.test(LQ.PICTURES[c.id]), 'pic ' + c.id)); });
});
test('Chinese: one pinyin syllable per character, valid tone detection', () => {
  Object.entries(LQ.LANGUAGES.zh.words).forEach(([id, w]) => {
    eq(Array.from(w.t).length, w.r.split(' ').length, id);
    w.r.split(' ').forEach(s => assert(/^[a-zǜ-ͯ]+$/.test(s.normalize('NFD')), id + ' bad syllable ' + s));
    assert(w.r.split(' ').some(s => LQ.tones.toneOf(s, 'pinyin') !== 5), id + ' has no tone mark');
  });
});
test('Chinese: simplified characters only (no common traditional forms)', () => {
  const trad = '們個這見謝對紅藍綠黃麵條雞飯寶愛國學顏歡麼來';
  const lines = [];
  Object.values(LQ.LANGUAGES.zh.dialogues).forEach(d => d.forEach(l => { lines.push(l); (l.wrong || []).forEach(x => lines.push(x)); }));
  Object.values(LQ.LANGUAGES.zh.words).concat(lines).forEach(w => Array.from(w.t).forEach(ch => assert(trad.indexOf(ch) < 0, 'traditional ' + ch)));
});
test('Spanish: nouns carry gender matching the article (el agua is feminine)', () => {
  Object.entries(LQ.LANGUAGES.es.words).forEach(([id, w]) => {
    const art = (w.t.match(/^(el|la|los|las)\s/) || [])[1];
    if (!art) { assert(!w.g, id + ' gender without article'); return; }
    assert(w.g, id + ' missing gender');
    if (id === 'water') { eq(w.g, 'f'); return; }
    if (id === 'hand') { eq(w.t, 'la mano'); eq(w.g, 'f'); return; }
    eq(w.g, /^(la|las)$/.test(art) ? 'f' : 'm', id);
  });
});
test('Vietnamese: Northern forms used (bố, quả)', () => {
  const v = LQ.LANGUAGES.vi.words;
  eq(v.dad.t, 'bố'); eq(v.pig.t, 'con lợn'); eq(v.hat.t, 'mũ'); eq(v.socks.t, 'tất'); assert(/^quả /.test(v.apple.t)); assert(/^quả /.test(v.banana.t)); eq(LQ.LANGUAGES.vi.variant, 'Northern (Hanoi)');
});
test('tips and 3-line dialogues for every unit and language', () => {
  LANGS.forEach(l => LQ.UNITS.forEach(u => {
    const L = LQ.LANGUAGES[l];
    assert(L.tips[u.id] && L.tips[u.id].length > 20, 'tip ' + l + u.id);
    const d = L.dialogues[u.id];
    eq(d.length, 3, 'dialogue ' + l + u.id); eq(d[1].s, 'you'); eq(d[1].wrong.length, 2);
    d.concat(d[1].wrong).forEach(x => { assert(x.t && x.en, 'line ' + l + u.id); if (l === 'zh') assert(x.r, 'pinyin ' + u.id); });
    d[1].wrong.forEach(x => assert(x.t !== d[1].t, 'wrong equals right ' + l + u.id));
  }));
});
test('simple characters for early readers have hints', () => {
  ['one', 'two', 'three', 'eight', 'hand', 'door', 'rain'].forEach(id => assert(LQ.LANGUAGES.zh.words[id].hint, id));
});

/* ---------- Tones ---------- */
test('pinyin tones and placement', () => {
  eq(['mā', 'má', 'mǎ', 'mà', 'ma'].map(s => LQ.tones.toneOf(s, 'pinyin')).join(), '1,2,3,4,5');
  eq(LQ.tones.retone('hǎo', 'pinyin', 4), 'hào'); eq(LQ.tones.retone('lǜ', 'pinyin', 1), 'lǖ');
  eq(LQ.tones.retone('shuǐ', 'pinyin', 2), 'shuí'); eq(LQ.tones.retone('liù', 'pinyin', 3), 'liǔ');
  eq(LQ.tones.retone('guǒ', 'pinyin', 1), 'guō'); eq(LQ.tones.retone('xiāng', 'pinyin', 4), 'xiàng');
});
test('Vietnamese six tones and placement', () => {
  eq(['ma', 'mà', 'má', 'mả', 'mã', 'mạ'].map(s => LQ.tones.toneOf(s, 'vietnamese')).join(), '1,2,3,4,5,6');
  eq(LQ.tones.retone('không', 'vietnamese', 3), 'khống'); eq(LQ.tones.retone('chào', 'vietnamese', 6), 'chạo');
  eq(LQ.tones.retone('quả', 'vietnamese', 2), 'quà'); eq(LQ.tones.retone('nước', 'vietnamese', 5), 'nưỡc');
  eq(LQ.tones.retone('gia', 'vietnamese', 2), 'già'); eq(LQ.tones.retone('biệt', 'vietnamese', 1), 'biêt');
  eq(LQ.tones.retone('mẹ', 'vietnamese', 1), 'me');
});
test('tone variants: every Chinese word gives 4 unique options, every Vietnamese word at least 2', () => {
  Object.values(LQ.LANGUAGES.zh.words).forEach(w => {
    const v = LQ.tones.toneVariants(w.r, 'pinyin', rng);
    eq(new Set(v.options).size, 4, w.r); assert(v.options.includes(w.r.normalize('NFC')), w.r);
  });
  Object.values(LQ.LANGUAGES.vi.words).forEach(w => {
    const v = LQ.tones.toneVariants(w.t, 'vietnamese', rng);
    assert(v && new Set(v.options).size >= 2 && v.options.includes(w.t.normalize('NFC')), w.t);
  });
});
test('tone spans keep spaces and colour each syllable', () => {
  const s = LQ.tones.toneSpans('nǐ hǎo', 'pinyin');
  eq(s.map(x => x.text).join(''), 'nǐ hǎo'); eq(s[0].tone, 3); eq(s[1].tone, null);
});

/* ---------- Questions ---------- */
test('question sets are valid for every band, language and unit', () => {
  ['pre', 'early', 'adult'].forEach(band => LANGS.forEach(l => LQ.UNITS.forEach(u => {
    const words = LQ.content.unitWords(l, u.id, []), pool = LQ.content.langWords(l, []);
    const n = LQ.BANDS[band].practise;
    const qs = LQ.questions.buildSet(words, pool, n, band, rng);
    eq(qs.length, n, band + l + u.id);
    qs.forEach(q => {
      assert(LQ.questions.KINDS[band].includes(q.kind) || q.kind === 'listen-pic' || q.kind === 'word-meaning', 'kind ' + q.kind);
      if (q.kind === 'listen-type') return;
      const keys = q.options.map(o => o.key);
      eq(new Set(keys).size, keys.length, 'unique options ' + q.kind);
      assert(keys.includes(q.answer), 'answer present ' + q.kind + ' ' + l + u.id);
      if (q.kind !== 'tone') {
        const texts = q.options.map(o => o.word.t), ens = q.options.map(o => o.word.en);
        eq(new Set(texts).size, texts.length, 'distinct texts'); eq(new Set(ens).size, ens.length, 'distinct meanings');
      }
      if (band === 'pre') assert(['listen-pic', 'pic-sound'].includes(q.kind), 'pre kind ' + q.kind);
      if (l === 'es') assert(q.kind !== 'tone', 'no tone questions for Spanish');
    });
  })));
});
test('pre-readers never get custom (text-only) words', () => {
  const custom = [{ id: 'c1', lang: 'zh', unit: 'greetings', en: 'teacher', t: '老师', r: 'lǎo shī' }];
  const qs = LQ.questions.buildSet(LQ.content.unitWords('zh', 'greetings', custom), LQ.content.langWords('zh', custom), 20, 'pre', rng);
  qs.forEach(q => q.options.forEach(o => assert(!o.word.custom)));
  const early = LQ.questions.buildSet(LQ.content.unitWords('zh', 'greetings', custom), LQ.content.langWords('zh', custom), 20, 'early', rng);
  assert(early.some(q => q.word.custom), 'readers do see custom words');
});
test('typed answers: exact spelling for every word is accepted', () => {
  LANGS.forEach(l => LQ.content.langWords(l, []).forEach(w => {
    const r = LQ.questions.checkTyped(w.t, w); assert(r.ok && r.exact, l + ' ' + w.t);
  }));
});
test('typed answers: lenient matching', () => {
  const zh = LQ.content.wordByKey('zh:hello', []), es = LQ.content.wordByKey('es:apple', []), vi = LQ.content.wordByKey('vi:banana', []);
  assert(LQ.questions.checkTyped('nǐ hǎo', zh).exact); assert(LQ.questions.checkTyped('nihao', zh).ok);
  assert(!LQ.questions.checkTyped('nihao', zh).exact); assert(!LQ.questions.checkTyped('ni', zh).ok);
  assert(LQ.questions.checkTyped('Manzana', es).exact); assert(LQ.questions.checkTyped('la manzana!', es).exact);
  assert(LQ.questions.checkTyped('qua chuoi', vi).ok && !LQ.questions.checkTyped('qua chuoi', vi).exact);
  assert(!LQ.questions.checkTyped('', vi).ok); assert(!LQ.questions.checkTyped('quả táo', vi).ok);
});
test('stars by attempts: 3, 2, 1', () => {
  eq(LQ.questions.starsFor(1), 3); eq(LQ.questions.starsFor(2), 2); eq(LQ.questions.starsFor(5), 1);
  eq(LQ.questions.unitStars([1, 1, 1, 1, 1]), 3); eq(LQ.questions.unitStars([1, 2, 2, 3, 2]), 2); eq(LQ.questions.unitStars([4, 4, 3, 3, 3]), 1);
});

/* ---------- SRS ---------- */
test('spaced repetition moves up on first-try, resets on a miss', () => {
  const D = LQ.srs.DAY; let e = LQ.srs.record(null, true, 0);
  eq(e.box, 1); eq(e.due, D);
  e = LQ.srs.record(e, true, D); eq(e.box, 2); eq(e.due, D + 2 * D);
  e = LQ.srs.record(e, false, 3 * D); eq(e.box, 1); eq(e.wrong, 1);
  assert(LQ.srs.isDue(e, 4 * D)); assert(!LQ.srs.isDue(e, 3 * D + 1));
  for (let i = 0; i < 10; i++) e = LQ.srs.record(e, true, 0);
  eq(e.box, 6); assert(LQ.srs.isMastered(e));
});
test('weakest words rank misses and low boxes first, mastered words excluded', () => {
  const srs = { a: { box: 1, wrong: 3, right: 0 }, b: { box: 5, wrong: 0, right: 5 }, c: { box: 2, wrong: 0, right: 2 } };
  eq(LQ.srs.weakest(srs, 5).map(x => x.id).join(), 'a,c');
});

/* ---------- Storage, streaks, backups ---------- */
const S = LQ.store;
function mk(name, o) { return Object.assign(S.newProfile({ name, band: 'adult' }), o || {}); }

test('new profile defaults to Chinese and normalises bad input', () => {
  const p = S.newProfile({ name: 'Tim' }); eq(p.langs.join(), 'zh'); eq(p.lang, 'zh'); eq(p.band, 'adult');
  const q = S.normalizeProfile({ name: 'X'.repeat(40), langs: ['xx', 'vi'], lang: 'zh', band: 'nope', avatar: 'dragon' });
  eq(q.name.length, 16); eq(q.langs.join(), 'vi'); eq(q.lang, 'vi'); eq(q.avatar, 'panda');
});
test('save and load round-trip, capped at 4 learners', () => {
  const st = S.defaultState(); for (let i = 0; i < 6; i++) st.profiles.push(mk('P' + i));
  S.save(st); const back = S.load(); eq(back.profiles.length, 4); eq(back.profiles[0].name, 'P0');
});
test('load survives corrupt storage', () => {
  store[S.KEY] = '{oops'; const s = S.load(); assert(Array.isArray(s.profiles));
});
test('personal streak counts back from today or yesterday', () => {
  const p = mk('A', { days: ['2026-10-09', '2026-10-10', '2026-10-11'] });
  eq(S.streak(p, '2026-10-12'), 3); eq(S.streak(p, '2026-10-11'), 3); eq(S.streak(p, '2026-10-14'), 0);
});
test('family streak only counts days when everyone practised', () => {
  const a = mk('A', { days: ['2026-10-10', '2026-10-11', '2026-10-12'] });
  const b = mk('B', { days: ['2026-10-11', '2026-10-12'] });
  eq(S.familyStreak([a, b], '2026-10-12'), 2);
  b.days = ['2026-10-12']; eq(S.familyStreak([a, b], '2026-10-12'), 1);
  eq(S.familyStreak([], '2026-10-12'), 0);
});
test('streaks cross month boundaries', () => {
  const p = mk('A', { days: ['2026-09-30', '2026-10-01'] }); eq(S.streak(p, '2026-10-01'), 2);
});
test('the first unit of world 2 opens only after the last unit of world 1', () => {
  const p = mk('A', { stars: { 'zh:greetings': 1, 'zh:numbers': 1, 'zh:colours': 1, 'zh:family': 1 } });
  assert(!S.unitUnlocked(p, 'zh', 5));
  p.stars['zh:food'] = 2; assert(S.unitUnlocked(p, 'zh', 5)); assert(!S.unitUnlocked(p, 'zh', 6));
});
test('units unlock in order per language', () => {
  const p = mk('A', { stars: { 'zh:greetings': 2 } });
  assert(S.unitUnlocked(p, 'zh', 0)); assert(S.unitUnlocked(p, 'zh', 1)); assert(!S.unitUnlocked(p, 'zh', 2));
  assert(!S.unitUnlocked(p, 'vi', 1));
});
test('backup export → parse round-trip keeps everything', () => {
  const st = S.defaultState();
  st.profiles.push(mk('Tim', { coins: 40, stars: { 'zh:greetings': 3 }, srs: { zh: { hello: { box: 3, due: 1, seen: 3, right: 3, wrong: 0, last: 1 } } }, days: ['2026-10-12'], stickers: ['zh:greetings'] }));
  st.custom.push({ id: 'c1', lang: 'zh', unit: 'food', en: 'dumpling', t: '饺子', r: 'jiǎo zi' });
  const text = JSON.stringify(S.exportData(st));
  const res = S.parseBackup(text);
  assert(res.ok); eq(res.summary.profiles.join(), 'Tim'); eq(res.summary.customWords, 1);
  eq(JSON.stringify(res.data.profiles[0]), JSON.stringify(S.normalizeProfile(st.profiles[0])));
});
test('single-learner export holds only that learner', () => {
  const st = S.defaultState(); st.profiles.push(mk('A'), mk('B'));
  const d = S.exportData(st, st.profiles[1].id); eq(d.profiles.length, 1); eq(d.profiles[0].name, 'B'); eq(d.scope, 'profile');
  assert(/^lingo-quest-backup-\d{4}-\d{2}-\d{2}-b\.json$/.test(S.backupFileName('B')));
});
test('parse rejects junk, other apps and newer schemas', () => {
  assert(!S.parseBackup('not json').ok); assert(!S.parseBackup('{"app":"other"}').ok);
  const r = S.parseBackup(JSON.stringify({ app: 'lingo-quest', schema: 99, profiles: [] }));
  assert(!r.ok && /newer/.test(r.error));
  assert(S.parseBackup(JSON.stringify({ app: 'lingo-quest', profiles: [] })).ok, 'schema 0 migrates');
});
test('merge keeps the best progress and adds new learners', () => {
  const a = mk('Tim', { coins: 10, stars: { 'zh:greetings': 1, 'zh:numbers': 3 }, days: ['2026-10-10'], srs: { zh: { hello: { box: 1, due: 0, seen: 1, right: 0, wrong: 1, last: 5 } } } });
  const st = S.defaultState(); st.profiles.push(a);
  const b = JSON.parse(JSON.stringify(a)); b.coins = 30; b.stars = { 'zh:greetings': 3 }; b.days = ['2026-10-11'];
  b.srs = { zh: { hello: { box: 4, due: 9, seen: 4, right: 3, wrong: 1, last: 9 }, thanks: { box: 1, due: 0, seen: 1, right: 1, wrong: 0, last: 9 } }, vi: { one: { box: 1, due: 0, seen: 1, right: 1, wrong: 0, last: 9 } } };
  b.langs = ['zh', 'vi'];
  const kid = mk('Kid');
  const out = S.mergeBackup(st, { profiles: [b, kid], custom: [{ id: 'c1', lang: 'zh', unit: 'food', en: 'x', t: '饺子', r: 'jiǎo zi' }] });
  const m = out.state.profiles[0];
  eq(m.coins, 30); eq(m.stars['zh:greetings'], 3); eq(m.stars['zh:numbers'], 3);
  eq(m.days.join(), '2026-10-10,2026-10-11'); eq(m.srs.zh.hello.box, 4); assert(m.srs.zh.thanks && m.srs.vi.one);
  eq(m.langs.join(), 'vi,zh'.split(',').sort().join()); eq(out.added.join(), 'Kid'); eq(out.updated.join(), 'Tim');
  eq(out.state.custom.length, 1); eq(st.profiles[0].coins, 10, 'input untouched');
});
test('merge skips learners beyond the 4-learner limit', () => {
  const st = S.defaultState(); for (let i = 0; i < 3; i++) st.profiles.push(mk('P' + i));
  const out = S.mergeBackup(st, { profiles: [mk('New1'), mk('New2')], custom: [] });
  eq(out.state.profiles.length, 4); eq(out.added.join(), 'New1'); eq(out.skipped.join(), 'New2');
});
test('replace swaps everything in', () => {
  const st = S.defaultState(); st.profiles.push(mk('Old'));
  const out = S.replaceBackup(st, { profiles: [mk('New')], custom: [], settings: { reminderDays: 14 } });
  eq(out.state.profiles.map(p => p.name).join(), 'New'); eq(out.state.settings.reminderDays, 14);
});
test('backup reminder: overdue after the chosen days, silent when off', () => {
  const st = S.defaultState(); const p = mk('A'); p.createdAt = 0; st.profiles.push(p);
  assert(S.backupOverdue(st, 31 * LQ.srs.DAY)); assert(!S.backupOverdue(st, 29 * LQ.srs.DAY));
  st.settings.lastBackup = 30 * LQ.srs.DAY; assert(!S.backupOverdue(st, 40 * LQ.srs.DAY));
  st.settings.backupReminder = false; assert(!S.backupOverdue(st, 999 * LQ.srs.DAY));
});
test('custom words validate and join their unit', () => {
  eq(S.normalizeCustom({ lang: 'zh', unit: 'nope', en: 'x', t: 'y' }), null);
  const c = S.normalizeCustom({ lang: 'es', unit: 'food', en: 'cheese', t: 'el queso' });
  const words = LQ.content.unitWords('es', 'food', [c]);
  eq(words.length, 9); assert(words[8].custom && /<svg/.test(words[8].pic));
});
test('word of the day is stable for a date and differs across days', () => {
  eq(LQ.content.wordOfDay('2026-10-12').id, LQ.content.wordOfDay('2026-10-12').id);
  const ids = new Set(); for (let d = 1; d <= 20; d++) ids.add(LQ.content.wordOfDay('2026-10-' + String(d).padStart(2, '0')).id);
  assert(ids.size > 8); eq(LQ.content.wordOfDay('2026-10-12').words.length, 3);
});
test('custom picture escapes markup', () => {
  assert(!/<script/.test(LQ.customPicture('<script>alert(1)</script>')));
});

run('unit').then(f => process.exit(f ? 1 : 0));
