/* Lingo Quest — sound effects, made with Web Audio so they work offline
   and need no sound files. Phones only allow audio after a tap, so the
   audio engine starts on the first touch. */
(function (LQ) {
  'use strict';

  var ctx = null, enabled = true, played = [];

  function AC() { try { return window.AudioContext || window.webkitAudioContext || null; } catch (e) { return null; } }
  function engine() {
    if (ctx) return ctx;
    var A = AC(); if (!A) return null;
    try { ctx = new A(); } catch (e) { ctx = null; }
    return ctx;
  }
  function unlock() {
    var c = engine(); if (!c) return;
    try {
      if (c.state === 'suspended' && c.resume) { var r = c.resume(); if (r && r.catch) r.catch(function () {}); }
      // A silent blip so iPhone lets later sounds play.
      var b = c.createBuffer(1, 1, 22050), s = c.createBufferSource();
      s.buffer = b; s.connect(c.destination); s.start(0);
    } catch (e) { /* ignore */ }
  }
  try {
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerdown', unlock, { capture: true });
      document.addEventListener('touchend', unlock, { capture: true });
    }
  } catch (e) { /* ignore */ }

  /* One note: frequency in Hz, start offset and length in seconds. */
  function note(c, out, f, at, len, type, vol, glideTo) {
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + at;
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + len);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + len + 0.05);
  }

  var SOUNDS = {
    // Bright rising two notes.
    correct: function (c, out) { note(c, out, 1046.5, 0, 0.16, 'triangle', 0.22); note(c, out, 1568, 0.09, 0.28, 'triangle', 0.22); },
    // Soft, low and short: says "not that one" without a harsh buzz.
    wrong: function (c, out) { note(c, out, 311, 0, 0.18, 'sine', 0.22, 247); note(c, out, 233, 0.16, 0.24, 'sine', 0.18, 196); },
    // A climbing arpeggio that lands on a chord, with a sparkle on top.
    complete: function (c, out) {
      [523.3, 659.3, 784, 1046.5].forEach(function (f, i) { note(c, out, f, i * 0.11, 0.22, 'triangle', 0.2); });
      [523.3, 659.3, 784].forEach(function (f) { note(c, out, f, 0.46, 0.7, 'sine', 0.12); });
      [2093, 2637, 3136].forEach(function (f, i) { note(c, out, f, 0.5 + i * 0.07, 0.18, 'sine', 0.06); });
    },
    // One "ding" per star, each a little higher.
    star1: function (c, out) { note(c, out, 1318.5, 0, 0.35, 'sine', 0.18); },
    star2: function (c, out) { note(c, out, 1568, 0, 0.35, 'sine', 0.18); },
    star3: function (c, out) { note(c, out, 2093, 0, 0.45, 'sine', 0.18); }
  };

  function play(name) {
    played.push(name); if (played.length > 30) played.shift();
    if (!enabled || !SOUNDS[name]) return false;
    var c = engine(); if (!c) return false;
    try {
      if (c.state === 'suspended' && c.resume) { var r = c.resume(); if (r && r.catch) r.catch(function () {}); }
      var out = c.createGain(); out.gain.value = 0.9; out.connect(c.destination);
      SOUNDS[name](c, out);
      return true;
    } catch (e) { return false; }
  }

  LQ.sfx = {
    play: play, unlock: unlock,
    setEnabled: function (on) { enabled = on !== false; },
    isEnabled: function () { return enabled; },
    played: played
  };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
