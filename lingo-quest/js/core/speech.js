/* Lingo Quest — audio through the browser's built-in speech voices,
   and optional "say it" practice through speech recognition. */
(function (LQ) {
  'use strict';

  function synth() { try { return window.speechSynthesis || null; } catch (e) { return null; } }

  function voices() {
    var s = synth();
    try { return s ? s.getVoices() || [] : []; } catch (e) { return []; }
  }

  /* Phones ship joke and retro voices alongside the natural ones (iPhone lists
     "Zarvox", "Bells", "Eddy", "Grandpa"…). Score voices so the most natural one
     wins: downloaded Premium/Enhanced voices first, novelty voices never. */
  var ROBOTIC = ['albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'good news', 'jester', 'organ',
    'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox', 'junior', 'ralph', 'fred', 'kathy', 'hysterical', 'deranged',
    'pipe organ', 'eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley'];
  var NATURAL = ['karen', 'lee', 'matilda', 'catherine', 'gordon', 'daniel', 'serena', 'kate', 'arthur', 'martha',
    'samantha', 'ava', 'allison', 'nicky', 'zoe', 'evan', 'tom', 'susan', 'google', 'microsoft', 'natural', 'neural',
    'tingting', 'ting-ting', 'lili', 'yu-shu', 'monica', 'mónica', 'paulina', 'jorge', 'linh', 'maged', 'majed', 'tarik', 'laila', 'mariam'];
  function vname(v) { return String(v.name || '').toLowerCase(); }
  function isRobotic(v) {
    var n = vname(v).replace(/\s*\(.*\)\s*$/, '');
    var uri = String(v.voiceURI || '').toLowerCase();
    return ROBOTIC.indexOf(n) >= 0 || uri.indexOf('eloquence') >= 0;
  }
  function score(v) {
    var n = vname(v), uri = String(v.voiceURI || '').toLowerCase(), sc = 0;
    if (isRobotic(v)) sc -= 1000;
    if (/premium/.test(n + uri)) sc += 300;
    if (/enhanced/.test(n + uri)) sc += 200;
    if (/siri/.test(n + uri)) sc += 150;
    if (NATURAL.some(function (w) { return n.indexOf(w) === 0 || n.indexOf(w) >= 0 && (w === 'google' || w === 'microsoft' || w === 'natural' || w === 'neural'); })) sc += 100;
    if (/compact/.test(uri)) sc -= 20;
    if (v.default) sc += 10;
    if (v.localService) sc += 5;
    return sc;
  }
  var norm = function (v) { return String(v.lang || '').toLowerCase().replace('_', '-'); };
  var preferred = {};   // language key -> voiceURI or name the family chose
  function setPreferred(map) { preferred = Object.assign({}, map || {}); }

  /* All voices for a language code, best first: exact region first, then any region. */
  function voicesFor(code) {
    var want = code.toLowerCase(), base = want.split('-')[0];
    var list = voices().filter(function (v) { return norm(v).split('-')[0] === base; });
    return list.slice().sort(function (a, b) {
      var ra = norm(a) === want ? 1 : 0, rb = norm(b) === want ? 1 : 0;
      return (score(b) + rb * 50) - (score(a) + ra * 50);
    });
  }
  function idOf(v) { return v ? (v.voiceURI || v.name) : null; }
  /* key: 'en' or a language id; uses the family's choice when that voice is on this device. */
  function pickVoice(code, key) {
    var list = voicesFor(code);
    var want = preferred[key || code];
    if (want) { var hit = list.filter(function (v) { return idOf(v) === want; })[0]; if (hit) return hit; }
    return list[0] || null;
  }

  /* English uses an Australian voice when the device has one. */
  function englishVoice() {
    var all = voicesFor('en-AU');
    var want = preferred.en;
    if (want) { var hit = all.filter(function (v) { return idOf(v) === want; })[0]; if (hit) return hit; }
    // Prefer a natural Australian voice, then a natural British or American one.
    var au = all.filter(function (v) { return norm(v) === 'en-au' && !isRobotic(v); })[0];
    var other = all.filter(function (v) { return !isRobotic(v); })[0];
    return au && score(au) >= (other ? score(other) - 150 : 0) ? au : (other || au || all[0] || null);
  }

  function utterance(text, lang, opts) {
    var u = new window.SpeechSynthesisUtterance(text);
    if (lang === 'en') {
      u.lang = 'en-AU';
      var ev = englishVoice(); if (ev) { u.voice = ev; u.lang = ev.lang; }
      u.rate = opts.enRate || 0.95;
    } else {
      var L = LQ.LANGUAGES[lang];
      u.lang = L ? (L.voice === 'es' ? 'es-ES' : L.voice) : lang;
      var v = L ? pickVoice(L.voice, L.id) : null;
      if (v) { u.voice = v; u.lang = v.lang; }
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
    var rows = [{ lang: 'en', name: 'English (instructions)', code: 'en-AU' }].concat(LQ.langList().map(function (L) { return { lang: L.id, name: L.name, code: L.voice }; }));
    return rows.map(function (r) {
      var v = r.lang === 'en' ? englishVoice() : pickVoice(r.code, r.lang);
      var options = voicesFor(r.code).map(function (x) { return { id: idOf(x), name: x.name, lang: x.lang, robotic: isRobotic(x), quality: /premium/i.test(x.name + x.voiceURI) ? 'Premium' : /enhanced/i.test(x.name + x.voiceURI) ? 'Enhanced' : '' }; });
      return { lang: r.lang, name: r.name, ok: !!v, voice: v ? v.name : null, voiceId: idOf(v), options: options, chosen: preferred[r.lang] || '' };
    });
  }
  /* Say a short sample in a language, for the voice picker. */
  var SAMPLE = { en: 'Hello! Let\'s learn some new words.', zh: '你好！我们一起学习吧。', es: '¡Hola! Vamos a aprender.', vi: 'Xin chào! Chúng ta cùng học nhé.', ar: 'مرحبا! هيا نتعلم معا.' };
  function sample(lang) { return sayParts([{ text: SAMPLE[lang] || SAMPLE.en, lang: lang }]); }
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

  LQ.speech = { unlock: unlock, speak: speak, sayParts: sayParts, englishVoice: englishVoice, voicesFor: voicesFor, isRobotic: isRobotic, setPreferred: setPreferred, sample: sample, stop: stop, pickVoice: pickVoice, report: report, onVoices: onVoices, canListen: canListen, listen: listen };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
