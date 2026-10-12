/* Lingo Quest — picture cards and avatars as SVG strings (viewBox 0 0 100 100).
   SVG keeps every card identical across phones, unlike emoji. */
(function (LQ) {
  'use strict';

  var INK = '#2b2d42';
  var SKIN = '#f6c9a0';

  function svg(body, bg) {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      (bg ? '<rect width="100" height="100" rx="18" fill="' + bg + '"/>' : '') + body + '</svg>';
  }
  function eyes(cx, cy, gap, r) {
    return '<circle cx="' + (cx - gap) + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>' +
      '<circle cx="' + (cx + gap) + '" cy="' + cy + '" r="' + r + '" fill="' + INK + '"/>';
  }
  function smile(cx, cy, w) {
    return '<path d="M' + (cx - w) + ' ' + cy + ' Q' + cx + ' ' + (cy + w * 0.9) + ' ' + (cx + w) + ' ' + cy +
      '" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  }
  function frown(cx, cy, w) {
    return '<path d="M' + (cx - w) + ' ' + (cy + w * 0.6) + ' Q' + cx + ' ' + (cy - w * 0.4) + ' ' + (cx + w) + ' ' + (cy + w * 0.6) +
      '" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  }
  function hand(x, y, rot, fill) {
    fill = fill || SKIN;
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')" fill="' + fill + '" stroke="#c9946b" stroke-width="1.5">' +
      '<rect x="-12" y="-6" width="24" height="24" rx="9"/>' +
      '<rect x="-11" y="-22" width="5.5" height="20" rx="2.75"/>' +
      '<rect x="-4.5" y="-26" width="5.5" height="24" rx="2.75"/>' +
      '<rect x="2" y="-24" width="5.5" height="22" rx="2.75"/>' +
      '<rect x="8.5" y="-18" width="5" height="16" rx="2.5"/>' +
      '<rect x="-20" y="0" width="12" height="6" rx="3" transform="rotate(-35 -14 3)"/></g>';
  }

  /* A simple person. o: x, y (feet), s (scale), hair, style, shirt, glasses, moustache. */
  function person(o) {
    var s = o.s || 1, hc = o.hair || '#4a3428', sh = o.shirt || '#4f8cc9';
    var p = '';
    if (o.style === 'long') p += '<path d="M33 40 Q33 18 50 18 Q67 18 67 40 L69 66 L31 66 Z" fill="' + hc + '"/>';
    if (o.style === 'pigtails') p += '<circle cx="30" cy="40" r="7" fill="' + hc + '"/><circle cx="70" cy="40" r="7" fill="' + hc + '"/>';
    p += '<path d="M30 96 Q30 60 50 60 Q70 60 70 96 Z" fill="' + sh + '"/>';
    p += '<circle cx="50" cy="40" r="17" fill="' + SKIN + '"/>';
    if (o.style === 'short' || o.style === 'pigtails' || o.style === 'long') {
      p += '<path d="M33 38 Q33 20 50 20 Q67 20 67 38 Q60 28 50 30 Q40 28 33 38 Z" fill="' + hc + '"/>';
    } else if (o.style === 'bun') {
      p += '<circle cx="50" cy="19" r="7" fill="' + hc + '"/><path d="M33 38 Q33 22 50 22 Q67 22 67 38 Q58 29 50 30 Q42 29 33 38 Z" fill="' + hc + '"/>';
    } else if (o.style === 'bald') {
      p += '<ellipse cx="34" cy="36" rx="3.5" ry="7" fill="' + hc + '"/><ellipse cx="66" cy="36" rx="3.5" ry="7" fill="' + hc + '"/>';
    } else if (o.style === 'curl') {
      p += '<path d="M50 23 q-5 -6 0 -9 q5 -1 3 4" fill="none" stroke="' + hc + '" stroke-width="2.6" stroke-linecap="round"/>';
    }
    p += eyes(50, 40, 6, 2.2) + smile(50, 46, 5);
    if (o.glasses) p += '<g fill="none" stroke="' + INK + '" stroke-width="1.6"><circle cx="44" cy="40" r="4.5"/><circle cx="56" cy="40" r="4.5"/><path d="M48.5 40 h3"/></g>';
    if (o.moustache) p += '<path d="M43 45 Q50 41 57 45 Q50 44 43 45 Z" fill="' + hc + '" stroke="' + hc + '" stroke-width="2"/>';
    if (o.blush) p += '<circle cx="40" cy="46" r="2.6" fill="#f29c9c"/><circle cx="60" cy="46" r="2.6" fill="#f29c9c"/>';
    var tx = (o.x || 50) - 50 * s, ty = (o.y || 96) - 96 * s;
    return '<g transform="translate(' + tx + ' ' + ty + ') scale(' + s + ')">' + p + '</g>';
  }

  function dots(n, color) {
    var layouts = {
      1: [[50, 50]], 2: [[34, 50], [66, 50]], 3: [[50, 32], [33, 64], [67, 64]],
      4: [[34, 34], [66, 34], [34, 66], [66, 66]], 5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
      6: [[32, 28], [68, 28], [32, 50], [68, 50], [32, 72], [68, 72]],
      7: [[30, 28], [70, 28], [30, 50], [50, 50], [70, 50], [30, 72], [70, 72]],
      8: [[28, 30], [50, 30], [72, 30], [39, 50], [61, 50], [28, 70], [50, 70], [72, 70]]
    };
    var r = n <= 4 ? 12 : 9.5;
    return svg(layouts[n].map(function (p) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '" fill="' + color + '" stroke="' + INK + '" stroke-width="1.5"/>' +
        '<circle cx="' + (p[0] - r * 0.35) + '" cy="' + (p[1] - r * 0.35) + '" r="' + (r * 0.25) + '" fill="#fff" opacity="0.7"/>';
    }).join('') + '<text x="88" y="94" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="' + INK + '" opacity="0.55">' + n + '</text>', '#fff8e7');
  }

  function splat(color, outline) {
    return svg('<path d="M50 16 C58 16 60 26 66 24 C76 21 82 30 78 38 C75 44 86 48 84 58 C82 68 72 66 70 74 C67 84 56 86 50 80 C44 86 32 84 30 75 C28 67 16 68 16 57 C16 48 26 46 23 38 C20 29 30 21 37 25 C42 28 43 16 50 16 Z" fill="' + color +
      '" stroke="' + (outline || 'none') + '" stroke-width="2"/><circle cx="84" cy="22" r="5" fill="' + color + '" stroke="' + (outline || 'none') + '" stroke-width="1.5"/><circle cx="18" cy="84" r="4" fill="' + color + '" stroke="' + (outline || 'none') + '" stroke-width="1.5"/>', '#f4f6fb');
  }

  function bowl(inside) {
    return inside + '<path d="M16 52 H84 Q82 82 50 84 Q18 82 16 52 Z" fill="#5b8fd6" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M24 62 H76" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 5" opacity="0.8"/>';
  }

  var P = {
    hello: svg('<circle cx="38" cy="58" r="27" fill="#ffd166" stroke="' + INK + '" stroke-width="2"/>' + eyes(38, 52, 9, 3) + smile(38, 64, 10) +
      hand(72, 42, 15) + '<path d="M84 18 q4 6 0 12 M90 13 q6 10 0 21" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>', '#e8f4ff'),
    goodbye: svg('<rect x="18" y="18" width="40" height="70" rx="3" fill="#8d5a3b"/><path d="M22 22 L44 28 L44 88 L22 84 Z" fill="#b27a52" stroke="' + INK + '" stroke-width="1.5"/><circle cx="40" cy="58" r="2.5" fill="#ffd166"/>' +
      hand(76, 50, -15) + '<path d="M60 28 q-5 6 0 12 M56 22 q-7 10 0 22" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>', '#fdf0e6'),
    thanks: svg('<path d="M50 84 C20 64 14 46 22 34 C30 22 46 26 50 38 C54 26 70 22 78 34 C86 46 80 64 50 84 Z" fill="#ef476f" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M30 40 Q34 32 42 34" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' +
      '<path d="M84 14 v10 M79 19 h10 M14 70 v8 M10 74 h8" stroke="#f4a259" stroke-width="2.5" stroke-linecap="round"/>', '#fff0f3'),
    yes: svg('<circle cx="50" cy="50" r="34" fill="#2bb673" stroke="' + INK + '" stroke-width="2"/><path d="M33 51 L45 63 L68 38" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>', '#eafaf1'),
    no: svg('<circle cx="50" cy="50" r="34" fill="#e63946" stroke="' + INK + '" stroke-width="2"/><path d="M36 36 L64 64 M64 36 L36 64" stroke="#fff" stroke-width="8" stroke-linecap="round"/>', '#fdecee'),
    please: svg('<g stroke="#c9946b" stroke-width="1.5" fill="' + SKIN + '"><path d="M50 20 Q40 22 38 40 L34 80 L50 82 Z"/><path d="M50 20 Q60 22 62 40 L66 80 L50 82 Z"/></g>' +
      '<path d="M50 24 V80" stroke="#c9946b" stroke-width="1.5"/><path d="M38 56 q-6 -6 -2 -14 M62 56 q6 -6 2 -14" fill="' + SKIN + '" stroke="#c9946b" stroke-width="1.5"/>' +
      '<rect x="32" y="78" width="36" height="12" rx="4" fill="#9b7ede"/><path d="M24 30 q-6 4 -4 10 M76 30 q6 4 4 10" fill="none" stroke="#f4a259" stroke-width="2.5" stroke-linecap="round"/>', '#f3efff'),
    sorry: svg('<circle cx="50" cy="52" r="30" fill="#ffd166" stroke="' + INK + '" stroke-width="2"/>' + eyes(50, 46, 10, 3) + frown(50, 62, 9) +
      '<path d="M36 52 q-3 7 0 10 q4 2 4 -3 q0 -3 -4 -7 Z" fill="#5bc0eb"/><path d="M33 38 l9 -5 M67 38 l-9 -5" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>', '#eef6ff'),
    morning: svg('<rect width="100" height="100" rx="18" fill="#cdeafe"/><circle cx="50" cy="66" r="20" fill="#ffd166" stroke="#f4a259" stroke-width="2"/>' +
      '<g stroke="#f4a259" stroke-width="3" stroke-linecap="round"><path d="M50 36 v-10 M28 46 l-7 -7 M72 46 l7 -7 M22 64 h-10 M78 64 h10"/></g>' +
      '<path d="M0 72 Q30 56 56 70 Q80 60 100 70 V82 Q100 100 82 100 H18 Q0 100 0 82 Z" fill="#6cc070"/>'),

    one: dots(1, '#ef476f'), two: dots(2, '#f4a259'), three: dots(3, '#ffd166'), four: dots(4, '#2bb673'),
    five: dots(5, '#4ea8de'), six: dots(6, '#9b7ede'), seven: dots(7, '#ef476f'), eight: dots(8, '#2bb673'),

    red: splat('#e63946'), blue: splat('#1d6fd1'), green: splat('#2bb673'), yellow: splat('#ffd23f'),
    black: splat('#1f1f24'), white: splat('#ffffff', '#9aa3b5'), pink: splat('#ff8fc7'), orange: splat('#ff8c1a'),

    mum: svg(person({ style: 'long', hair: '#5a3b2a', shirt: '#ef476f', blush: true }), '#fff0f3'),
    dad: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#1d6fd1' }), '#e8f4ff'),
    grandma: svg(person({ style: 'bun', hair: '#c9c9cf', shirt: '#9b7ede', glasses: true, blush: true }), '#f3efff'),
    grandpa: svg(person({ style: 'bald', hair: '#c9c9cf', shirt: '#2bb673', moustache: true, glasses: true }), '#eafaf1'),
    brother: svg(person({ style: 'short', hair: '#3b2a20', shirt: '#f4a259', s: 0.85 }), '#fff4e6'),
    sister: svg(person({ style: 'pigtails', hair: '#3b2a20', shirt: '#ffd166', s: 0.85, blush: true }), '#fffbe6'),
    baby: svg(person({ style: 'curl', hair: '#5a3b2a', shirt: '#7fd1d9', s: 0.74, blush: true }), '#e9fbfc'),
    family: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#1d6fd1', s: 0.58, x: 27, y: 94 }) +
      person({ style: 'long', hair: '#5a3b2a', shirt: '#ef476f', s: 0.58, x: 73, y: 94 }) +
      person({ style: 'pigtails', hair: '#3b2a20', shirt: '#ffd166', s: 0.45, x: 50, y: 96 }) +
      '<path d="M50 14 C44 9 38 14 42 19 L50 26 L58 19 C62 14 56 9 50 14 Z" fill="#ef476f"/>', '#fff8e7'),

    apple: svg('<path d="M50 34 C38 24 18 30 20 54 C22 76 38 88 50 82 C62 88 78 76 80 54 C82 30 62 24 50 34 Z" fill="#e63946" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M50 34 Q50 22 56 16" fill="none" stroke="#6b4226" stroke-width="3.5" stroke-linecap="round"/><path d="M56 22 Q70 12 76 22 Q66 30 56 22 Z" fill="#2bb673"/>' +
      '<path d="M30 48 Q32 40 40 38" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.6"/>', '#fdecee'),
    banana: svg('<path d="M22 30 C20 62 40 84 76 76 C82 74 82 70 78 70 C48 72 34 56 30 30 C29 26 23 26 22 30 Z" fill="#ffd23f" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M22 30 L24 22 L30 24 L29 30" fill="#6b4226"/><path d="M34 46 Q40 62 56 68" fill="none" stroke="#e0b100" stroke-width="2"/>', '#fffbe6'),
    rice: svg(bowl('<path d="M20 54 Q22 30 50 28 Q78 30 80 54 Z" fill="#ffffff" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<g fill="#e7e2d6"><ellipse cx="38" cy="40" rx="3" ry="1.6"/><ellipse cx="52" cy="36" rx="3" ry="1.6"/><ellipse cx="62" cy="44" rx="3" ry="1.6"/><ellipse cx="46" cy="47" rx="3" ry="1.6"/></g>'), '#f4f6fb'),
    noodles: svg('<path d="M60 10 L40 52 M72 12 L48 52" stroke="#b27a52" stroke-width="3.5" stroke-linecap="round"/>' +
      bowl('<path d="M22 54 Q22 38 50 38 Q78 38 78 54 Z" fill="#f6d77a"/><path d="M28 50 q6 -8 12 0 t12 0 t12 0 t10 -2 M30 44 q6 -6 12 0 t12 0 t12 0" fill="none" stroke="#d9a520" stroke-width="2.2"/>'), '#fff8e7'),
    water: svg('<path d="M30 20 H70 L64 86 Q63 90 58 90 H42 Q37 90 36 86 Z" fill="#ffffff" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M33 44 Q42 40 50 44 Q58 48 67 44 L64 86 Q63 89 58 89 H42 Q37 89 36 86 Z" fill="#5bc0eb"/>' +
      '<path d="M40 54 v24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/>', '#eef8ff'),
    milk: svg('<path d="M32 30 L42 16 H58 L68 30 V88 H32 Z" fill="#ffffff" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path d="M32 30 H68" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="32" y="44" width="36" height="26" fill="#4ea8de"/><path d="M50 49 Q44 58 46 62 Q50 67 54 62 Q56 58 50 49 Z" fill="#fff"/>', '#eef6ff'),
    bread: svg('<path d="M16 50 Q14 28 36 28 H66 Q86 28 84 50 Q84 56 78 58 V80 Q78 84 74 84 H26 Q22 84 22 80 V58 Q16 56 16 50 Z" fill="#e2a35f" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M38 40 l6 8 M52 38 l6 8 M66 40 l5 7" stroke="#a8692c" stroke-width="3" stroke-linecap="round"/>', '#fff4e6'),
    egg: svg('<ellipse cx="50" cy="56" rx="24" ry="30" fill="#fff7ea" stroke="' + INK + '" stroke-width="2"/><path d="M38 42 Q40 34 46 32" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="88" rx="22" ry="3" fill="#000" opacity="0.08"/>', '#fdf6e3')
  };

  /* Avatars for the profile picker. */
  function animal(body) { return svg(body); }
  var AVATARS = {
    panda: animal('<circle cx="24" cy="24" r="12" fill="#2b2d42"/><circle cx="76" cy="24" r="12" fill="#2b2d42"/><circle cx="50" cy="54" r="36" fill="#fff" stroke="#2b2d42" stroke-width="2"/>' +
      '<ellipse cx="36" cy="50" rx="9" ry="11" fill="#2b2d42" transform="rotate(-20 36 50)"/><ellipse cx="64" cy="50" rx="9" ry="11" fill="#2b2d42" transform="rotate(20 64 50)"/>' +
      '<circle cx="37" cy="50" r="3" fill="#fff"/><circle cx="63" cy="50" r="3" fill="#fff"/><ellipse cx="50" cy="64" rx="5" ry="3.5" fill="#2b2d42"/>' + smile(50, 70, 5)),
    cat: animal('<path d="M18 40 L22 10 L42 26 Z M82 40 L78 10 L58 26 Z" fill="#f4a259" stroke="#2b2d42" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="56" r="34" fill="#f4a259" stroke="#2b2d42" stroke-width="2"/>' +
      eyes(50, 50, 12, 4) + '<path d="M46 60 L54 60 L50 65 Z" fill="#ef476f"/>' + smile(50, 66, 5) +
      '<path d="M22 60 h14 M22 66 h14 M64 60 h14 M64 66 h14" stroke="#2b2d42" stroke-width="1.5"/>'),
    fox: animal('<path d="M16 46 L20 8 L44 30 Z M84 46 L80 8 L56 30 Z" fill="#ff8c1a" stroke="#2b2d42" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M14 44 Q50 22 86 44 Q80 76 50 90 Q20 76 14 44 Z" fill="#ff8c1a" stroke="#2b2d42" stroke-width="2"/><path d="M28 62 Q50 60 72 62 Q64 82 50 90 Q36 82 28 62 Z" fill="#fff"/>' +
      eyes(50, 52, 13, 3.6) + '<circle cx="50" cy="78" r="4.5" fill="#2b2d42"/>'),
    bear: animal('<circle cx="22" cy="26" r="13" fill="#9c6b44" stroke="#2b2d42" stroke-width="2"/><circle cx="78" cy="26" r="13" fill="#9c6b44" stroke="#2b2d42" stroke-width="2"/>' +
      '<circle cx="50" cy="55" r="35" fill="#9c6b44" stroke="#2b2d42" stroke-width="2"/><ellipse cx="50" cy="66" rx="15" ry="11" fill="#e2b48a"/>' +
      eyes(50, 48, 12, 4) + '<ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#2b2d42"/>' + smile(50, 68, 5)),
    frog: animal('<circle cx="30" cy="28" r="14" fill="#6cc070" stroke="#2b2d42" stroke-width="2"/><circle cx="70" cy="28" r="14" fill="#6cc070" stroke="#2b2d42" stroke-width="2"/>' +
      '<ellipse cx="50" cy="60" rx="38" ry="30" fill="#6cc070" stroke="#2b2d42" stroke-width="2"/><circle cx="30" cy="28" r="7" fill="#fff"/><circle cx="70" cy="28" r="7" fill="#fff"/>' +
      '<circle cx="31" cy="29" r="3.5" fill="#2b2d42"/><circle cx="69" cy="29" r="3.5" fill="#2b2d42"/>' + smile(50, 62, 16) +
      '<circle cx="28" cy="66" r="4" fill="#f29c9c"/><circle cx="72" cy="66" r="4" fill="#f29c9c"/>'),
    owl: animal('<path d="M20 30 L30 12 L40 26 Z M80 30 L70 12 L60 26 Z" fill="#8a6fd1"/><ellipse cx="50" cy="56" rx="34" ry="36" fill="#8a6fd1" stroke="#2b2d42" stroke-width="2"/>' +
      '<circle cx="36" cy="46" r="13" fill="#fff" stroke="#2b2d42" stroke-width="2"/><circle cx="64" cy="46" r="13" fill="#fff" stroke="#2b2d42" stroke-width="2"/>' +
      '<circle cx="36" cy="46" r="5" fill="#2b2d42"/><circle cx="64" cy="46" r="5" fill="#2b2d42"/><path d="M45 58 L55 58 L50 68 Z" fill="#ffd166" stroke="#2b2d42" stroke-width="1.5"/>' +
      '<ellipse cx="50" cy="80" rx="18" ry="9" fill="#b9a7ec"/>')
  };

  /* Picture for a custom word with no illustration: a card with its English word. */
  function customPicture(en) {
    var label = String(en || '?').replace(/[<>&"]/g, '').slice(0, 14);
    return svg('<rect x="10" y="22" width="80" height="56" rx="12" fill="#fff" stroke="#9aa3b5" stroke-width="2"/>' +
      '<text x="50" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-size="' + (label.length > 8 ? 12 : 16) + '" font-weight="700" fill="' + INK + '">' + label + '</text>', '#f4f6fb');
  }

  LQ.PICTURES = P;
  LQ.AVATARS = AVATARS;
  LQ.customPicture = customPicture;
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
