/* Lingo Quest — spaced repetition (Leitner boxes).
   Each word a learner has seen has { box, due, seen, right, wrong, last }.
   A first-try correct answer moves it up a box; a miss drops it to box 1. */
(function (LQ) {
  'use strict';

  var DAY = 24 * 60 * 60 * 1000;
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // days, by box
  var MAX_BOX = INTERVALS.length - 1;
  var MASTERED = 4; // pinyin fades from this box up

  function record(entry, firstTry, now) {
    var e = entry ? Object.assign({}, entry) : { box: 0, due: 0, seen: 0, right: 0, wrong: 0, last: 0 };
    e.seen += 1;
    if (firstTry) { e.right += 1; e.box = Math.min(MAX_BOX, e.box + 1); }
    else { e.wrong += 1; e.box = 1; }
    e.last = now;
    e.due = now + INTERVALS[e.box] * DAY;
    return e;
  }

  function isDue(entry, now) { return !!entry && entry.due <= now; }

  /* Weakness score: low box and many misses rank first. */
  function weakness(entry) {
    if (!entry) return 0;
    return (MAX_BOX - entry.box) * 10 + entry.wrong * 3 - entry.right;
  }

  function weakest(srsLang, n) {
    return Object.keys(srsLang || {})
      .map(function (id) { return { id: id, e: srsLang[id] }; })
      .filter(function (x) { return x.e.wrong > 0 || x.e.box < MASTERED; })
      .sort(function (a, b) { return weakness(b.e) - weakness(a.e); })
      .slice(0, n);
  }

  function dueIds(srsLang, now) {
    return Object.keys(srsLang || {}).filter(function (id) { return isDue(srsLang[id], now); })
      .sort(function (a, b) { return srsLang[a].due - srsLang[b].due; });
  }

  function isMastered(entry) { return !!entry && entry.box >= MASTERED; }

  /* Merge two entries from different devices: keep the stronger record. */
  function mergeEntry(a, b) {
    if (!a) return b; if (!b) return a;
    var best = (b.box > a.box || (b.box === a.box && b.last > a.last)) ? b : a;
    return Object.assign({}, best, {
      seen: Math.max(a.seen, b.seen), right: Math.max(a.right, b.right), wrong: Math.max(a.wrong, b.wrong),
      last: Math.max(a.last, b.last)
    });
  }

  LQ.srs = {
    DAY: DAY, INTERVALS: INTERVALS, MASTERED: MASTERED, record: record, isDue: isDue,
    weakest: weakest, dueIds: dueIds, isMastered: isMastered, mergeEntry: mergeEntry
  };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
