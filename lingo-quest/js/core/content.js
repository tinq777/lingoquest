/* Lingo Quest — word lookup across the registries and parent-added custom words. */
(function (LQ) {
  'use strict';

  function makeWord(lang, unit, concept, entry) {
    return {
      key: lang + ':' + concept.id, id: concept.id, lang: lang, unit: unit.id, en: concept.en,
      t: entry.t, r: entry.r || null, g: entry.g || null, hint: entry.hint || null,
      pic: LQ.PICTURES[concept.id] || LQ.customPicture(concept.en), custom: false
    };
  }
  function makeCustom(c) {
    return {
      key: c.lang + ':' + c.id, id: c.id, lang: c.lang, unit: c.unit, en: c.en,
      t: c.t, r: c.r || null, g: c.g || null, hint: null, pic: LQ.customPicture(c.en), custom: true
    };
  }

  /* All words for one unit in one language, built-ins first then custom. */
  function unitWords(lang, unitId, custom) {
    var L = LQ.LANGUAGES[lang], unit = LQ.unitById(unitId);
    if (!L || !unit) return [];
    var out = [];
    unit.concepts.forEach(function (c) { if (L.words[c.id]) out.push(makeWord(lang, unit, c, L.words[c.id])); });
    (custom || []).forEach(function (c) { if (c.lang === lang && c.unit === unitId) out.push(makeCustom(c)); });
    return out;
  }

  function langWords(lang, custom) {
    var out = [];
    LQ.UNITS.forEach(function (u) { out = out.concat(unitWords(lang, u.id, custom)); });
    return out;
  }

  function wordByKey(key, custom) {
    var parts = String(key).split(':');
    var lang = parts[0], id = parts.slice(1).join(':');
    var all = langWords(lang, custom);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  /* Deterministic word of the day from the shared concepts, shown in every language. */
  function wordOfDay(dayKey) {
    var concepts = [];
    LQ.UNITS.forEach(function (u) { u.concepts.forEach(function (c) { concepts.push({ unit: u, concept: c }); }); });
    var h = 0, s = String(dayKey);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var pick = concepts[h % concepts.length];
    return {
      id: pick.concept.id, en: pick.concept.en, unit: pick.unit.id,
      words: LQ.langList().map(function (L) { return makeWord(L.id, pick.unit, pick.concept, L.words[pick.concept.id]); })
    };
  }

  LQ.content = { unitWords: unitWords, langWords: langWords, wordByKey: wordByKey, wordOfDay: wordOfDay };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
