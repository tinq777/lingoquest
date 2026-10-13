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
    please: svg('<circle cx="40" cy="60" r="26" fill="#ffd166" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M28 56 q5 -5 10 0 M42 56 q5 -5 10 0" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<circle cx="29" cy="65" r="3.2" fill="#f29c9c"/><circle cx="51" cy="65" r="3.2" fill="#f29c9c"/>' + smile(40, 69, 7) +
      '<path d="M56 12 H90 Q94 12 94 16 V42 Q94 46 90 46 H70 L60 54 L62 46 H56 Q52 46 52 42 V16 Q52 12 56 12 Z" fill="#fff" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="62" y="24" width="22" height="16" rx="2" fill="#ef476f" stroke="' + INK + '" stroke-width="1.5"/><rect x="60" y="19" width="26" height="6" rx="2" fill="#ef476f" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<path d="M73 19 V40" stroke="#ffd166" stroke-width="3"/><path d="M73 19 q-7 -8 -9 -2 q2 3 9 2 q7 -8 9 -2 q-2 3 -9 2" fill="#ffd166" stroke="' + INK + '" stroke-width="1.2"/>', '#f3efff'),
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

  /* ---------- World 2 ---------- */
  var S = ' stroke="' + INK + '" stroke-width="2"';
  /* A big face with one part ringed, for the Body unit. */
  function bodyFace(ring, extra) {
    return svg('<path d="M28 44 Q28 18 50 18 Q72 18 72 44 Q64 30 50 32 Q36 30 28 44 Z" fill="#3b2a20"/>' +
      '<ellipse cx="25" cy="54" rx="6" ry="9" fill="' + SKIN + '"' + S + '/><ellipse cx="75" cy="54" rx="6" ry="9" fill="' + SKIN + '"' + S + '/>' +
      '<ellipse cx="50" cy="56" rx="25" ry="29" fill="' + SKIN + '"' + S + '/>' +
      '<path d="M27 46 Q30 26 50 26 Q70 26 73 46 Q64 36 50 37 Q36 36 27 46 Z" fill="#3b2a20"/>' +
      eyes(50, 52, 10, 3) + '<path d="M50 56 q-3 7 0 9" fill="none" stroke="#c9946b" stroke-width="2" stroke-linecap="round"/>' + smile(50, 70, 7) +
      (extra || '') + ring, '#fff8e7');
  }
  function ringAt(cx, cy, rx, ry) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#ef476f" stroke-width="3.5" stroke-dasharray="6 4"/>';
  }
  function thermo(fill, level) {
    return '<rect x="64" y="18" width="14" height="56" rx="7" fill="#fff"' + S + '/><circle cx="71" cy="78" r="11" fill="' + fill + '"' + S + '/>' +
      '<rect x="68" y="' + (74 - level) + '" width="6" height="' + level + '" rx="3" fill="' + fill + '"/>';
  }
  function cloudShape(x, y, s, fill) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M14 40 Q2 40 2 30 Q2 20 14 20 Q16 6 32 6 Q46 6 50 18 Q64 16 66 30 Q68 40 56 40 Z" fill="' + fill + '"' + S + '/></g>';
  }

  Object.assign(P, {
    dog: svg('<ellipse cx="22" cy="44" rx="11" ry="22" fill="#8d5a3b"' + S + ' transform="rotate(15 22 44)"/><ellipse cx="78" cy="44" rx="11" ry="22" fill="#8d5a3b"' + S + ' transform="rotate(-15 78 44)"/>' +
      '<circle cx="50" cy="52" r="28" fill="#d9a066"' + S + '/><ellipse cx="50" cy="66" rx="15" ry="11" fill="#f3d6b0"/>' + eyes(50, 46, 11, 3.5) +
      '<ellipse cx="50" cy="60" rx="6" ry="4.5" fill="' + INK + '"/><path d="M50 64 v4" stroke="' + INK + '" stroke-width="2"/>' + smile(50, 69, 6) +
      '<path d="M47 74 q3 8 6 0" fill="#ef476f"/>', '#fdf0e6'),
    bird: svg('<path d="M18 50 Q24 34 40 40 L30 54 Z" fill="#2b8ad6"' + S + '/><ellipse cx="52" cy="54" rx="26" ry="22" fill="#4ea8de"' + S + '/>' +
      '<path d="M40 56 Q52 74 66 58 Q56 66 40 56 Z" fill="#2b8ad6"/><circle cx="64" cy="48" r="3.5" fill="' + INK + '"/>' +
      '<path d="M77 50 L90 54 L77 58 Z" fill="#f4a259"' + S + ' stroke-linejoin="round"/><path d="M46 76 v10 M56 76 v10 M42 86 h8 M52 86 h8" stroke="#f4a259" stroke-width="3" stroke-linecap="round"/>', '#e8f4ff'),
    fish: svg('<path d="M70 50 L90 34 L88 66 Z" fill="#ff8c1a"' + S + ' stroke-linejoin="round"/><ellipse cx="46" cy="50" rx="32" ry="20" fill="#ffa94d"' + S + '/>' +
      '<path d="M44 34 Q50 44 44 66" fill="none" stroke="#e07a10" stroke-width="2"/><circle cx="28" cy="46" r="4" fill="' + INK + '"/>' +
      '<path d="M20 56 q4 3 8 0" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="26" r="3" fill="none" stroke="#5bc0eb" stroke-width="2"/><circle cx="12" cy="16" r="4" fill="none" stroke="#5bc0eb" stroke-width="2"/>', '#e3f4fb'),
    rabbit: svg('<ellipse cx="38" cy="26" rx="8" ry="22" fill="#f4f4f6"' + S + '/><ellipse cx="62" cy="26" rx="8" ry="22" fill="#f4f4f6"' + S + '/>' +
      '<ellipse cx="38" cy="28" rx="3.5" ry="15" fill="#ffc2d4"/><ellipse cx="62" cy="28" rx="3.5" ry="15" fill="#ffc2d4"/>' +
      '<circle cx="50" cy="62" r="26" fill="#f4f4f6"' + S + '/>' + eyes(50, 58, 10, 3.5) + '<path d="M46 66 L54 66 L50 71 Z" fill="#ef476f"/>' +
      '<path d="M50 71 v4 M44 77 q6 4 12 0" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/><circle cx="36" cy="70" r="3" fill="#ffc2d4"/><circle cx="64" cy="70" r="3" fill="#ffc2d4"/>', '#f3efff'),
    horse: svg('<path d="M34 22 L40 8 L46 22 Z M54 22 L60 8 L66 22 Z" fill="#8d5a3b"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M32 26 Q50 14 68 26 L66 70 Q64 90 50 90 Q36 90 34 70 Z" fill="#a8693f"' + S + '/>' +
      '<path d="M44 16 Q50 30 46 44 Q54 32 56 18 Z" fill="#3b2a20"/><ellipse cx="50" cy="78" rx="14" ry="11" fill="#d9a066"/>' + eyes(50, 44, 12, 3.5) +
      '<circle cx="45" cy="78" r="2.5" fill="' + INK + '"/><circle cx="55" cy="78" r="2.5" fill="' + INK + '"/>', '#fdf0e6'),
    cow: svg('<path d="M22 30 Q14 22 16 14 Q24 18 28 26 Z M78 30 Q86 22 84 14 Q76 18 72 26 Z" fill="#e7e2d6"' + S + '/>' +
      '<ellipse cx="18" cy="40" rx="10" ry="6" fill="#fff"' + S + '/><ellipse cx="82" cy="40" rx="10" ry="6" fill="#fff"' + S + '/>' +
      '<ellipse cx="50" cy="50" rx="27" ry="30" fill="#fff"' + S + '/><path d="M30 32 Q40 26 44 38 Q36 46 28 42 Z" fill="' + INK + '"/>' +
      '<ellipse cx="50" cy="70" rx="20" ry="13" fill="#ffc2d4"' + S + '/>' + eyes(50, 48, 11, 3.5) +
      '<ellipse cx="43" cy="70" rx="3" ry="4" fill="#c97a8f"/><ellipse cx="57" cy="70" rx="3" ry="4" fill="#c97a8f"/>', '#eafaf1'),
    pig: svg('<path d="M24 34 L22 16 L40 26 Z M76 34 L78 16 L60 26 Z" fill="#ff9fbf"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="50" cy="54" r="30" fill="#ffb8cf"' + S + '/>' + eyes(50, 46, 12, 3.5) +
      '<ellipse cx="50" cy="62" rx="13" ry="9" fill="#ff8fb3"' + S + '/><ellipse cx="45" cy="62" rx="2.5" ry="3.5" fill="#b34d72"/><ellipse cx="55" cy="62" rx="2.5" ry="3.5" fill="#b34d72"/>' +
      smile(50, 75, 6), '#fff0f3'),

    head: bodyFace(ringAt(50, 50, 33, 38)),
    eye: bodyFace(ringAt(60, 52, 9, 8)),
    ear: bodyFace(ringAt(75, 54, 10, 13)),
    nose: bodyFace(ringAt(50, 61, 8, 8)),
    mouth: bodyFace(ringAt(50, 73, 12, 7)),
    hair: bodyFace(ringAt(50, 30, 26, 13)),
    hand: svg(hand(50, 58, 0) .replace('translate(50 58)', 'translate(50 58) scale(1.7)'), '#fff8e7'),
    foot: svg('<path d="M40 36 Q60 32 64 50 Q68 66 62 80 Q56 92 44 90 Q32 88 34 74 Q36 62 32 50 Q30 38 40 36 Z" fill="' + SKIN + '" stroke="#c9946b" stroke-width="2"/>' +
      '<g fill="' + SKIN + '" stroke="#c9946b" stroke-width="2"><ellipse cx="36" cy="24" rx="7" ry="8"/><ellipse cx="48" cy="18" rx="5" ry="6"/><ellipse cx="58" cy="19" rx="4.5" ry="5.5"/><ellipse cx="66" cy="24" rx="4" ry="5"/><ellipse cx="72" cy="32" rx="3.5" ry="4.5"/></g>', '#fff8e7'),

    house: svg('<path d="M14 48 L50 18 L86 48 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><rect x="22" y="46" width="56" height="40" fill="#ffd166"' + S + '/>' +
      '<rect x="42" y="60" width="16" height="26" fill="#8d5a3b"' + S + '/><rect x="27" y="54" width="12" height="11" fill="#cdeafe"' + S + '/><rect x="61" y="54" width="12" height="11" fill="#cdeafe"' + S + '/>' +
      '<rect x="64" y="24" width="8" height="14" fill="#8d5a3b"' + S + '/>', '#e8f4ff'),
    door: svg('<rect x="28" y="12" width="44" height="78" rx="4" fill="#a8693f"' + S + '/><rect x="34" y="18" width="32" height="28" rx="3" fill="none" stroke="#7a4a2a" stroke-width="2"/>' +
      '<rect x="34" y="52" width="32" height="32" rx="3" fill="none" stroke="#7a4a2a" stroke-width="2"/><circle cx="64" cy="50" r="3.5" fill="#ffd166"' + S + '/>', '#fdf0e6'),
    window: svg('<rect x="18" y="16" width="64" height="66" rx="4" fill="#cdeafe"' + S + '/><path d="M50 16 V82 M18 49 H82" stroke="' + INK + '" stroke-width="3"/>' +
      '<circle cx="32" cy="32" r="7" fill="#ffd166"/><path d="M58 70 Q64 60 72 70" fill="#6cc070"/><rect x="12" y="80" width="76" height="8" rx="3" fill="#a8693f"' + S + '/>' +
      '<path d="M22 20 l10 0 M22 24 l6 0" stroke="#fff" stroke-width="2"/>', '#f4f6fb'),
    bed: svg('<rect x="12" y="36" width="10" height="50" rx="3" fill="#8d5a3b"' + S + '/><rect x="78" y="52" width="10" height="34" rx="3" fill="#8d5a3b"' + S + '/>' +
      '<rect x="18" y="56" width="66" height="16" rx="4" fill="#fff"' + S + '/><rect x="38" y="48" width="48" height="16" rx="5" fill="#4ea8de"' + S + '/>' +
      '<ellipse cx="30" cy="51" rx="9" ry="6" fill="#fff"' + S + '/><path d="M60 26 q4 -4 8 0 M70 18 q3 -3 6 0" fill="none" stroke="#9b7ede" stroke-width="2.5" stroke-linecap="round"/>' +
      '<text x="80" y="30" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="#9b7ede">z</text>', '#f3efff'),
    table: svg('<rect x="12" y="38" width="76" height="10" rx="3" fill="#c98a4b"' + S + '/><rect x="18" y="48" width="8" height="38" fill="#a8693f"' + S + '/><rect x="74" y="48" width="8" height="38" fill="#a8693f"' + S + '/>' +
      '<path d="M40 38 Q38 26 44 24 H56 Q62 26 60 38" fill="#ef476f"' + S + '/><path d="M46 24 Q44 14 50 12 Q56 14 54 24" fill="#2bb673"/>', '#fdf0e6'),
    chair: svg('<rect x="30" y="14" width="40" height="38" rx="5" fill="#2bb673"' + S + '/><rect x="24" y="50" width="52" height="10" rx="3" fill="#25a065"' + S + '/>' +
      '<rect x="28" y="60" width="7" height="28" fill="#1f8a56"' + S + '/><rect x="65" y="60" width="7" height="28" fill="#1f8a56"' + S + '/><path d="M38 24 h24 M38 32 h24 M38 40 h24" stroke="#1f8a56" stroke-width="2"/>', '#eafaf1'),
    book: svg('<path d="M14 26 Q32 18 50 26 V84 Q32 76 14 84 Z" fill="#fff"' + S + '/><path d="M86 26 Q68 18 50 26 V84 Q68 76 86 84 Z" fill="#fff"' + S + '/>' +
      '<path d="M20 38 Q32 33 44 38 M20 48 Q32 43 44 48 M20 58 Q32 53 44 58 M56 38 Q68 33 80 38 M56 48 Q68 43 80 48" fill="none" stroke="#9aa3b5" stroke-width="2"/>' +
      '<path d="M10 30 V88 Q30 80 50 88 Q70 80 90 88 V30" fill="none" stroke="#ef476f" stroke-width="3"/>', '#fff0f3'),
    tv: svg('<rect x="12" y="24" width="76" height="52" rx="8" fill="' + INK + '"/><rect x="18" y="30" width="64" height="40" rx="4" fill="#4ea8de"/>' +
      '<circle cx="36" cy="46" r="7" fill="#ffd166"/><path d="M18 70 L40 52 L56 64 L66 56 L82 70 Z" fill="#6cc070"/><path d="M38 24 L28 10 M62 24 L72 10" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<rect x="36" y="78" width="28" height="6" rx="3" fill="' + INK + '"/>', '#f4f6fb'),

    shirt: svg('<path d="M36 16 L22 22 L10 40 L24 48 L28 40 V86 H72 V40 L76 48 L90 40 L78 22 L64 16 Q50 28 36 16 Z" fill="#4ea8de"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M50 26 V86" stroke="#2b7fc0" stroke-width="2"/><circle cx="50" cy="40" r="2" fill="#fff"/><circle cx="50" cy="54" r="2" fill="#fff"/><circle cx="50" cy="68" r="2" fill="#fff"/>' +
      '<path d="M36 16 L44 30 L50 26 L56 30 L64 16" fill="#fff"' + S + ' stroke-linejoin="round"/>', '#e8f4ff'),
    trousers: svg('<path d="M28 12 H72 L80 88 H56 L50 42 L44 88 H20 Z" fill="#3e5c99"' + S + ' stroke-linejoin="round"/><rect x="28" y="12" width="44" height="9" fill="#2f4a80"' + S + '/>' +
      '<path d="M40 22 V32 M60 22 V32" stroke="#2f4a80" stroke-width="2"/>', '#eef2fb'),
    shoes: svg('<path d="M10 62 Q10 48 20 46 L30 44 Q36 54 46 52 L48 62 Q48 72 40 72 H14 Q10 72 10 66 Z" fill="#ef476f"' + S + '/>' +
      '<path d="M52 66 Q52 52 62 50 L72 48 Q78 58 88 56 L90 66 Q90 76 82 76 H56 Q52 76 52 70 Z" fill="#ef476f"' + S + '/>' +
      '<path d="M10 66 H48 M52 70 H90" stroke="#fff" stroke-width="3"/><path d="M24 50 l4 4 M28 48 l4 4 M66 54 l4 4 M70 52 l4 4" stroke="#fff" stroke-width="2"/>', '#fff0f3'),
    socks: svg('<path d="M22 14 H40 V54 L48 66 Q52 76 42 80 L26 84 Q14 84 16 72 L22 58 Z" fill="#ffd166"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M58 18 H76 V58 L84 70 Q88 80 78 84 L62 88 Q50 88 52 76 L58 62 Z" fill="#9b7ede"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M22 22 H40 M22 28 H40 M58 26 H76 M58 32 H76" stroke="#fff" stroke-width="3"/>', '#fffbe6'),
    hat: svg('<ellipse cx="50" cy="66" rx="40" ry="12" fill="#e2a35f"' + S + '/><path d="M28 64 Q26 30 50 28 Q74 30 72 64 Z" fill="#e2a35f"' + S + '/>' +
      '<path d="M28 56 Q50 62 72 56 L72 64 Q50 70 28 64 Z" fill="#ef476f"/>', '#fdf6e3'),
    dress: svg('<path d="M38 12 L34 34 Q36 40 40 42 L20 88 H80 L60 42 Q64 40 66 34 L62 12 Q56 20 50 20 Q44 20 38 12 Z" fill="#ff8fc7"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M40 42 H60" stroke="' + INK + '" stroke-width="2"/><circle cx="36" cy="64" r="3" fill="#fff"/><circle cx="54" cy="58" r="3" fill="#fff"/><circle cx="64" cy="74" r="3" fill="#fff"/><circle cx="44" cy="78" r="3" fill="#fff"/>', '#fff0f3'),
    coat: svg('<path d="M34 12 L18 22 L12 70 L24 72 L28 44 V90 H72 V44 L76 72 L88 70 L82 22 L66 12 L50 30 Z" fill="#2bb673"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M50 30 V90" stroke="' + INK + '" stroke-width="2"/><path d="M34 12 L42 34 L50 30 L58 34 L66 12" fill="#25a065"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="56" cy="46" r="2.5" fill="' + INK + '"/><circle cx="56" cy="60" r="2.5" fill="' + INK + '"/><circle cx="56" cy="74" r="2.5" fill="' + INK + '"/><rect x="32" y="62" width="12" height="9" rx="2" fill="none"' + S + '/>', '#eafaf1'),
    glasses: svg('<circle cx="30" cy="52" r="16" fill="#e3f4fb" stroke="' + INK + '" stroke-width="4"/><circle cx="70" cy="52" r="16" fill="#e3f4fb" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M46 50 Q50 44 54 50 M14 48 L6 40 M86 48 L94 40" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><path d="M22 46 l6 -4 M62 46 l6 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>', '#f4f6fb'),

    sun: svg('<g stroke="#f4a259" stroke-width="4" stroke-linecap="round"><path d="M50 8 v12 M50 80 v12 M8 50 h12 M80 50 h12 M20 20 l9 9 M71 71 l9 9 M80 20 l-9 9 M29 71 l-9 9"/></g>' +
      '<circle cx="50" cy="50" r="24" fill="#ffd166" stroke="#f4a259" stroke-width="3"/>' + eyes(50, 46, 8, 2.6) + smile(50, 56, 7), '#e8f4ff'),
    rain: svg(cloudShape(16, 10, 1.05, '#c5ccd8') + '<g fill="#4ea8de"><path d="M30 62 q-4 8 0 10 q4 -2 0 -10 Z"/><path d="M50 70 q-4 8 0 10 q4 -2 0 -10 Z"/><path d="M70 62 q-4 8 0 10 q4 -2 0 -10 Z"/><path d="M40 82 q-3 6 0 8 q3 -2 0 -8 Z"/><path d="M60 82 q-3 6 0 8 q3 -2 0 -8 Z"/></g>', '#eef2fb'),
    wind: svg('<g fill="none" stroke="#4ea8de" stroke-width="5" stroke-linecap="round"><path d="M10 38 H62 Q74 38 74 28 Q74 18 64 20"/><path d="M10 54 H78 Q90 54 90 64 Q90 74 80 72"/><path d="M18 70 H50 Q58 70 58 78"/></g>' +
      '<path d="M66 40 Q78 34 82 44 Q72 50 66 40 Z" fill="#2bb673"/>', '#eef8ff'),
    snow: svg('<g stroke="#4ea8de" stroke-width="5" stroke-linecap="round"><path d="M50 14 V86 M19 32 L81 68 M19 68 L81 32"/>' +
      '<path d="M42 20 L50 28 L58 20 M42 80 L50 72 L58 80 M20 44 L30 40 L27 30 M80 56 L70 60 L73 70 M20 56 L30 60 L27 70 M80 44 L70 40 L73 30" fill="none" stroke-width="3.5"/></g>', '#eef8ff'),
    cloud: svg(cloudShape(12, 22, 1.15, '#ffffff') + eyes(46, 54, 8, 2.6) + smile(46, 62, 5), '#cdeafe'),
    hot: svg('<circle cx="34" cy="38" r="18" fill="#ffd166" stroke="#f4a259" stroke-width="3"/><g stroke="#f4a259" stroke-width="3" stroke-linecap="round"><path d="M34 10 v6 M34 60 v6 M6 38 h6 M56 38 h6 M14 18 l4 4 M50 54 l4 4 M54 18 l-4 4 M18 54 l-4 4"/></g>' + thermo('#e63946', 40), '#fff0e6'),
    cold: svg('<g stroke="#4ea8de" stroke-width="4" stroke-linecap="round"><path d="M32 18 V62 M13 29 L51 51 M13 51 L51 29"/></g>' + thermo('#4ea8de', 10), '#eef8ff'),
    rainbow: svg('<g fill="none" stroke-width="7"><path d="M12 76 A38 38 0 0 1 88 76" stroke="#e63946"/><path d="M19 76 A31 31 0 0 1 81 76" stroke="#ff8c1a"/><path d="M26 76 A24 24 0 0 1 74 76" stroke="#ffd23f"/><path d="M33 76 A17 17 0 0 1 67 76" stroke="#2bb673"/><path d="M40 76 A10 10 0 0 1 60 76" stroke="#4ea8de"/></g>' +
      cloudShape(4, 62, 0.45, '#fff') + cloudShape(66, 62, 0.45, '#fff'), '#e8f4ff')
  });

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

  // The cat card reuses the cat avatar drawing on a card background.
  P.cat = AVATARS.cat.replace('aria-hidden="true">', 'aria-hidden="true"><rect width="100" height="100" rx="18" fill="#fff4e6"/>');

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
