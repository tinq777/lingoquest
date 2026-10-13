/* Lingo Quest — question generation and answer checking.
   The age band decides which kinds of question a learner sees. */
(function (LQ) {
  'use strict';

  var KINDS = {
    pre: ['listen-pic', 'pic-sound', 'listen-pic'],
    early: ['listen-pic', 'word-pic', 'pic-word', 'tone'],
    adult: ['word-meaning', 'meaning-word', 'listen-type', 'tone', 'listen-pic']
  };

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function toneSystem(lang) { return LQ.LANGUAGES[lang] ? LQ.LANGUAGES[lang].tones : null; }

  /* Pick n distractor words, distinct from the answer by id, text and meaning. */
  function distractors(word, pool, n, rng) {
    var seenT = {}, seenEn = {};
    seenT[word.t] = true; seenEn[word.en] = true;
    var same = shuffle(pool.filter(function (w) { return w.unit === word.unit; }), rng);
    var rest = shuffle(pool.filter(function (w) { return w.unit !== word.unit; }), rng);
    var out = [];
    same.concat(rest).forEach(function (w) {
      if (out.length >= n || w.id === word.id || seenT[w.t] || seenEn[w.en]) return;
      seenT[w.t] = true; seenEn[w.en] = true; out.push(w);
    });
    return out;
  }

  var counter = 0;
  function make(kind, word, pool, band, rng) {
    var nOpts = LQ.BANDS[band].options;
    var q = { id: 'q' + (++counter), kind: kind, lang: word.lang, word: word, answer: word.key };
    if (kind === 'pic-sound') nOpts = 2;
    if (kind === 'pic-word') nOpts = 3;
    if (kind === 'tone') {
      var sys = toneSystem(word.lang);
      var src = sys === 'pinyin' ? word.r : word.t;
      var v = sys && src ? LQ.tones.toneVariants(src, sys, rng) : null;
      if (!v) return null;
      q.system = sys;
      q.options = shuffle(v.options, rng).map(function (s) { return { key: s, label: s }; });
      q.answer = v.answer;
      return q;
    }
    if (kind === 'listen-type') { q.options = []; return q; }
    var ds = distractors(word, pool, nOpts - 1, rng);
    if (ds.length < Math.min(nOpts - 1, 1)) return null;
    q.options = shuffle([word].concat(ds), rng).map(function (w) { return { key: w.key, word: w }; });
    return q;
  }

  /* Build a session of `count` questions for the given words. srsLang lets
     weak words come up more than once. */
  function buildSet(words, pool, count, band, rng, srsLang) {
    rng = rng || Math.random;
    if (band === 'pre') { words = words.filter(function (w) { return !w.custom; }); pool = pool.filter(function (w) { return !w.custom; }); }
    if (!words.length) return [];
    var kinds = KINDS[band] || KINDS.adult;
    var ordered = shuffle(words, rng);
    if (srsLang) {
      ordered.sort(function (a, b) {
        var ea = srsLang[a.id], eb = srsLang[b.id];
        return (ea ? ea.box : -1) - (eb ? eb.box : -1);
      });
    }
    var out = [], k = Math.floor(rng() * kinds.length), guard = 0;
    while (out.length < count && guard < count * 6) {
      var w = ordered[out.length % ordered.length];
      var kind = kinds[k % kinds.length]; k++; guard++;
      var q = make(kind, w, pool, band, rng);
      if (!q) q = make(band === 'pre' ? 'listen-pic' : (band === 'adult' ? 'word-meaning' : 'listen-pic'), w, pool, band, rng);
      if (q) out.push(q);
    }
    return out;
  }

  function stripArticle(s) { return s.replace(/^(el|la|los|las|un|una)\s+/, ''); }

  /* Check a typed answer. Returns { ok, exact }. Close spellings without
     accents or tone marks count, but show the exact spelling. */
  function checkTyped(input, word) {
    var T = LQ.tones, raw = String(input || '');
    if (!T.tidy(raw)) return { ok: false, exact: false };
    var nospace = function (s) { return s.replace(/\s+/g, ''); };
    if (word.lang === 'zh' || word.lang === 'ar') {
      // Characters / Arabic script, or the romanised spelling.
      if (nospace(T.tidy(raw)) === nospace(T.tidy(word.t))) return { ok: true, exact: true };
      if (word.lang === 'ar' && nospace(T.loose(raw)) === nospace(T.loose(word.t))) return { ok: true, exact: false };
      if (word.r && nospace(T.tidy(raw)) === nospace(T.tidy(word.r))) return { ok: true, exact: true };
      if (word.r && nospace(T.loose(raw)) === nospace(T.loose(word.r))) return { ok: true, exact: false };
      return { ok: false, exact: false };
    }
    var a = T.tidy(raw), b = T.tidy(word.t);
    if (a === b || (word.lang === 'es' && stripArticle(a) === stripArticle(b))) return { ok: true, exact: true };
    var la = T.loose(raw), lb = T.loose(word.t);
    if (la === lb || (word.lang === 'es' && stripArticle(la) === stripArticle(lb))) return { ok: true, exact: false };
    return { ok: false, exact: false };
  }

  /* Stars by number of attempts, as in Chess Quest. */
  function starsFor(attempts) { return attempts <= 1 ? 3 : attempts === 2 ? 2 : 1; }
  function unitStars(attemptList) {
    if (!attemptList.length) return 1;
    var avg = attemptList.reduce(function (a, n) { return a + starsFor(n); }, 0) / attemptList.length;
    return Math.max(1, Math.min(3, Math.round(avg)));
  }

  LQ.questions = { KINDS: KINDS, buildSet: buildSet, make: make, checkTyped: checkTyped, starsFor: starsFor, unitStars: unitStars, shuffle: shuffle, distractors: distractors };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
