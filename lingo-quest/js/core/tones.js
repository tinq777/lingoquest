/* Lingo Quest — tone detection, tone colouring and tone variants for
   Mandarin pinyin and Northern Vietnamese. Works on Unicode NFD so tone
   marks are separate combining characters. */
(function (LQ) {
  'use strict';

  var PINYIN_MARKS = { '̄': 1, '́': 2, '̌': 3, '̀': 4 };
  var PINYIN_BY_TONE = { 1: '̄', 2: '́', 3: '̌', 4: '̀' };
  // Vietnamese: 1 ngang (flat), 2 huyền, 3 sắc, 4 hỏi, 5 ngã, 6 nặng
  var VI_MARKS = { '̀': 2, '́': 3, '̉': 4, '̃': 5, '̣': 6 };
  var VI_BY_TONE = { 2: '̀', 3: '́', 4: '̉', 5: '̃', 6: '̣' };
  var VI_MODIFIERS = { '̂': 1, '̆': 1, '̛': 1 };

  var TONE_INFO = {
    pinyin: {
      1: { name: '1st tone', short: 'high', color: '#d62839' },
      2: { name: '2nd tone', short: 'rising', color: '#1f9d55' },
      3: { name: '3rd tone', short: 'dip', color: '#1d6fd1' },
      4: { name: '4th tone', short: 'falling', color: '#8e3fd1' },
      5: { name: 'neutral', short: 'light', color: '#6b7280' }
    },
    vietnamese: {
      1: { name: 'ngang', short: 'flat', color: '#6b7280' },
      2: { name: 'huyền', short: 'falling', color: '#1d6fd1' },
      3: { name: 'sắc', short: 'rising', color: '#d62839' },
      4: { name: 'hỏi', short: 'dipping', color: '#1f9d55' },
      5: { name: 'ngã', short: 'broken', color: '#d9730d' },
      6: { name: 'nặng', short: 'heavy', color: '#8e3fd1' }
    }
  };

  function nfd(s) { return String(s).normalize('NFD'); }
  function nfc(s) { return String(s).normalize('NFC'); }

  function toneOf(syllable, system) {
    var d = nfd(syllable);
    var map = system === 'pinyin' ? PINYIN_MARKS : VI_MARKS;
    for (var i = 0; i < d.length; i++) if (map[d[i]]) return map[d[i]];
    return system === 'pinyin' ? 5 : 1;
  }

  /* Split a string into tokens keeping spaces and punctuation, each word
     token tagged with its tone. */
  function toneSpans(str, system) {
    return String(str).split(/(\s+)/).filter(function (p) { return p !== ''; }).map(function (p) {
      if (/^\s+$/.test(p) || !system) return { text: p, tone: null };
      return { text: p, tone: toneOf(p, system) };
    });
  }

  function stripTone(syllable, system) {
    var map = system === 'pinyin' ? PINYIN_MARKS : VI_MARKS;
    return nfd(syllable).split('').filter(function (c) { return !map[c]; }).join('');
  }

  // Break an NFD string into units: a base letter plus its combining marks.
  function units(d) {
    var out = [];
    for (var i = 0; i < d.length; i++) {
      if (/[̀-ͯ]/.test(d[i]) && out.length) out[out.length - 1].marks += d[i];
      else out.push({ base: d[i], marks: '' });
    }
    return out;
  }

  function pinyinTarget(us) {
    var vowels = [];
    us.forEach(function (u, i) { if (/[aeiouv]/i.test(u.base)) vowels.push(i); });
    if (!vowels.length) return -1;
    for (var a = 0; a < vowels.length; a++) if (/[ae]/i.test(us[vowels[a]].base)) return vowels[a];
    for (var o = 0; o < vowels.length - 1; o++) {
      if (/o/i.test(us[vowels[o]].base) && /u/i.test(us[vowels[o + 1]].base)) return vowels[o];
    }
    return vowels[vowels.length - 1];
  }

  function viTarget(us) {
    var isV = function (u) { return /[aeiouy]/i.test(u.base); };
    var start = 0;
    var low = us.map(function (u) { return u.base.toLowerCase(); }).join('');
    if (/^qu/.test(low) && us.length > 2) start = 2;
    else if (/^gi/.test(low) && us.length > 2 && isV(us[2])) start = 2;
    while (start < us.length && !isV(us[start])) start++;
    if (start >= us.length) return -1;
    var end = start;
    while (end + 1 < us.length && isV(us[end + 1])) end++;
    var withMod = -1;
    for (var i = start; i <= end; i++) {
      for (var k = 0; k < us[i].marks.length; k++) if (VI_MODIFIERS[us[i].marks[k]]) withMod = i;
    }
    if (withMod >= 0) return withMod;
    var hasFinal = end < us.length - 1;
    if (hasFinal || start === end) return end;
    return end - 1;
  }

  /* Return the syllable re-marked with the given tone. */
  function retone(syllable, system, tone) {
    var bare = stripTone(syllable, system);
    var mark = (system === 'pinyin' ? PINYIN_BY_TONE : VI_BY_TONE)[tone];
    if (!mark) return nfc(bare);
    var us = units(bare);
    var t = system === 'pinyin' ? pinyinTarget(us) : viTarget(us);
    if (t < 0) return nfc(bare);
    us[t].marks += mark;
    return nfc(us.map(function (u) { return u.base + u.marks; }).join(''));
  }

  function isWordToken(s) { return /[A-Za-zÀ-ỹ]/.test(nfc(s)) || /[a-z]/i.test(nfd(s)); }

  /* Build tone-variant options for a word string. Returns { options, answer }
     where options are unique strings including the answer, or null. */
  function toneVariants(str, system, rng) {
    rng = rng || Math.random;
    var parts = String(str).split(' ');
    var plain = system === 'pinyin' ? 5 : 1;
    var idxs = [];
    parts.forEach(function (p, i) { if (isWordToken(p) && toneOf(p, system) !== plain) idxs.push(i); });
    if (!idxs.length) parts.forEach(function (p, i) { if (isWordToken(p)) idxs.push(i); });
    if (!idxs.length) return null;
    var at = idxs[Math.floor(rng() * idxs.length)];
    var tones = system === 'pinyin' ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6];
    var own = toneOf(parts[at], system);
    var others = tones.filter(function (t) { return t !== own; });
    for (var i = others.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var tmp = others[i]; others[i] = others[j]; others[j] = tmp; }
    var answer = nfc(str);
    var seen = {}; seen[answer] = true;
    var opts = [answer];
    for (var n = 0; n < others.length && opts.length < 4; n++) {
      var copy = parts.slice(); copy[at] = retone(parts[at], system, others[n]);
      var v = nfc(copy.join(' '));
      if (!seen[v]) { seen[v] = true; opts.push(v); }
    }
    if (opts.length < 2) return null;
    return { options: opts, answer: answer, syllable: at };
  }

  /* Loose comparison form: no marks, no punctuation, lower case. */
  function loose(s) {
    return nfd(s).replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase().replace(/[¡!¿?.,，。！？、'’"]/g, '').replace(/\s+/g, ' ').trim();
  }
  function tidy(s) {
    return nfc(String(s)).toLowerCase().replace(/[¡!¿?.,，。！？、'’"]/g, '').replace(/\s+/g, ' ').trim();
  }

  LQ.tones = {
    INFO: TONE_INFO, toneOf: toneOf, toneSpans: toneSpans, retone: retone,
    toneVariants: toneVariants, stripTone: stripTone, loose: loose, tidy: tidy
  };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
