/* Lingo Quest — audio through the browser's built-in speech voices,
   and optional "say it" practice through speech recognition. */
(function (LQ) {
  'use strict';

  function synth() { try { return window.speechSynthesis || null; } catch (e) { return null; } }

  function voices() {
    var s = synth();
    try { return s ? s.getVoices() || [] : []; } catch (e) { return []; }
  }

  /* Best voice for a language code: exact match, then same language. */
  function pickVoice(code) {
    var list = voices(), want = code.toLowerCase(), base = want.split('-')[0];
    var norm = function (v) { return String(v.lang || '').toLowerCase().replace('_', '-'); };
    return list.filter(function (v) { return norm(v) === want; })[0] ||
      list.filter(function (v) { return norm(v).split('-')[0] === base; })[0] || null;
  }

  /* English uses an Australian voice when the device has one. */
  function englishVoice() { return pickVoice('en-AU') || pickVoice('en-GB') || pickVoice('en-US') || pickVoice('en'); }

  function utterance(text, lang, opts) {
    var u = new window.SpeechSynthesisUtterance(text);
    if (lang === 'en') {
      u.lang = 'en-AU';
      var ev = englishVoice(); if (ev) { u.voice = ev; u.lang = ev.lang; }
      u.rate = opts.enRate || 0.95;
    } else {
      var L = LQ.LANGUAGES[lang];
      u.lang = L ? (L.voice === 'es' ? 'es-ES' : L.voice) : lang;
      var v = L ? pickVoice(L.voice) : null;
      if (v) u.voice = v;
      u.rate = opts.rate || 0.85;
    }
    return u;
  }

  /* Say several parts in order, e.g. [{ text: 'apple', lang: 'en' }, { text: '苹果', lang: 'zh' }]. */
  function sayParts(parts, opts) {
    opts = opts || {};
    var s = synth();
    parts = (parts || []).filter(function (x) { return x && x.text; });
    if (!s || !parts.length || typeof window.SpeechSynthesisUtterance !== 'function') return false;
    try {
      s.cancel();
      parts.forEach(function (x, i) {
        var u = utterance(x.text, x.lang, opts);
        if (i === parts.length - 1 && opts.onend) u.onend = opts.onend;
        s.speak(u);
      });
      return true;
    } catch (e) { return false; }
  }

  function speak(text, lang, opts) { return sayParts([{ text: text, lang: lang }], opts); }

  function stop() { var s = synth(); try { if (s) s.cancel(); } catch (e) { /* ignore */ } }

  /* Which languages have a device voice. Voices load asynchronously, so the
     report is refreshed when the browser says the list changed. */
  function report() {
    return LQ.langList().map(function (L) {
      var v = pickVoice(L.voice);
      return { lang: L.id, name: L.name, ok: !!v, voice: v ? v.name : null };
    });
  }
  function onVoices(cb) {
    var s = synth();
    if (!s) return function () {};
    try { s.addEventListener('voiceschanged', cb); } catch (e) { s.onvoiceschanged = cb; }
    return function () { try { s.removeEventListener('voiceschanged', cb); } catch (e) { /* ignore */ } };
  }

  function Recognition() { try { return window.SpeechRecognition || window.webkitSpeechRecognition || null; } catch (e) { return null; } }
  function canListen() { return !!Recognition(); }

  /* Listen once. cb({ heard, ok }) where ok uses a loose match. */
  function listen(word, cb) {
    var R = Recognition();
    if (!R) { cb({ heard: '', ok: false, error: 'unsupported' }); return function () {}; }
    var L = LQ.LANGUAGES[word.lang], done = false;
    var rec = new R();
    rec.lang = L.voice === 'es' ? 'es-ES' : L.voice;
    rec.maxAlternatives = 5;
    rec.interimResults = false;
    var finish = function (r) { if (!done) { done = true; cb(r); } };
    rec.onresult = function (e) {
      var alts = [];
      for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript);
      var target = LQ.tones.loose(word.t).replace(/^(el|la|los|las)\s+/, '');
      var ok = alts.some(function (a) {
        var h = LQ.tones.loose(a);
        return h.indexOf(target) >= 0 || (word.r && h.replace(/\s/g, '').indexOf(LQ.tones.loose(word.r).replace(/\s/g, '')) >= 0) ||
          a.replace(/\s/g, '').indexOf(word.t) >= 0;
      });
      finish({ heard: alts[0] || '', ok: ok });
    };
    rec.onerror = function (e) { finish({ heard: '', ok: false, error: e.error || 'error' }); };
    rec.onend = function () { finish({ heard: '', ok: false, error: 'nothing' }); };
    try { rec.start(); } catch (e) { finish({ heard: '', ok: false, error: 'start' }); }
    return function () { try { rec.abort(); } catch (e) { /* ignore */ } };
  }

  /* iPhones only allow speech that starts inside a tap. Speak a silent
     utterance on the first tap so later automatic audio is allowed. */
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    var s = synth();
    if (!s || typeof window.SpeechSynthesisUtterance !== 'function') return;
    try { var u = new window.SpeechSynthesisUtterance(' '); u.volume = 0; s.speak(u); unlocked = true; } catch (e) { /* ignore */ }
  }
  try {
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerdown', unlock, { once: true, capture: true });
      document.addEventListener('touchend', unlock, { once: true, capture: true });
    }
  } catch (e) { /* ignore */ }

  LQ.speech = { unlock: unlock, speak: speak, sayParts: sayParts, englishVoice: englishVoice, stop: stop, pickVoice: pickVoice, report: report, onVoices: onVoices, canListen: canListen, listen: listen };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
