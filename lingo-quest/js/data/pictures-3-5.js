/* Lingo Quest — picture cards for worlds 3 to 5 (viewBox 0 0 100 100). */
(function (LQ) {
  'use strict';
  var D = LQ.draw, svg = D.svg, eyes = D.eyes, smile = D.smile, frown = D.frown, person = D.person, ringAt = D.ringAt, cloudShape = D.cloudShape;
  var INK = D.INK, SKIN = D.SKIN, S = D.S;
  var SK = ' stroke="#c9946b" stroke-width="2"';

  function face(cx, cy, r, fill) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (fill || '#ffd166') + '"' + S + '/>'; }
  function line(d, col, w) { return '<path d="' + d + '" fill="none" stroke="' + (col || INK) + '" stroke-width="' + (w || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function text(x, y, t, size, col, weight) {
    var fam = /[\u4e00-\u9fff]/.test(t) ? "'PingFang SC','Hiragino Sans GB','Noto Sans CJK SC','Noto Sans SC','Microsoft YaHei',sans-serif" : 'system-ui,sans-serif';
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="' + fam + '" font-size="' + size + '" font-weight="' + (weight || 800) + '" fill="' + (col || INK) + '">' + t + '</text>';
  }
  function star(cx, cy, r, fill) {
    var pts = [];
    for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + pts.join(' ') + '" fill="' + (fill || '#ffd166') + '" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>';
  }
  /* A simple child figure for actions. Limbs are [x1,y1,x2,y2] from the body. */
  function kid(o) {
    var c = o.shirt || '#4ea8de', hx = o.hx || 50, hy = o.hy || 26;
    var limb = function (l, col) { return line('M' + l.join(' '), col || SKIN, 7); };
    var out = '';
    (o.legs || []).forEach(function (l) { out += limb(l, o.trousers || '#3e5c99'); });
    out += line('M' + o.body.join(' '), c, 14);
    (o.arms || []).forEach(function (l) { out += limb(l); });
    out += '<circle cx="' + hx + '" cy="' + hy + '" r="11" fill="' + SKIN + '"' + SK + '/>';
    out += '<path d="M' + (hx - 11) + ' ' + (hy - 2) + ' Q' + hx + ' ' + (hy - 18) + ' ' + (hx + 11) + ' ' + (hy - 2) + ' Q' + hx + ' ' + (hy - 8) + ' ' + (hx - 11) + ' ' + (hy - 2) + ' Z" fill="#3b2a20"/>';
    out += eyes(hx + (o.look || 0), hy + 1, 4, 1.6) + smile(hx + (o.look || 0), hy + 5, 3.5);
    return out;
  }
  function calendar(extra) {
    return '<rect x="16" y="20" width="68" height="64" rx="8" fill="#fff"' + S + '/><path d="M16 28 Q16 20 24 20 H76 Q84 20 84 28 V38 H16 Z" fill="#ef476f"' + S + '/>' +
      '<path d="M32 14 V26 M68 14 V26" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      (function () { var g = ''; for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) g += '<rect x="' + (22 + c * 15) + '" y="' + (44 + r * 13) + '" width="11" height="9" rx="2" fill="#e7ecf5"/>'; return g; })() + (extra || '');
  }
  function building(body, roof, col) {
    return '<rect x="18" y="38" width="64" height="50" rx="3" fill="' + (col || '#fff') + '"' + S + '/>' + (roof || '') + (body || '');
  }
  function arrowShape(dir, col) {
    var d = dir === 'left' ? 'M80 40 H44 V26 L14 50 L44 74 V60 H80 Z' : 'M20 40 H56 V26 L86 50 L56 74 V60 H20 Z';
    return '<path d="' + d + '" fill="' + col + '"' + S + ' stroke-linejoin="round"/>';
  }
  function tag(extra, col) {
    return '<path d="M12 46 L32 24 H84 Q88 24 88 28 V64 Q88 68 84 68 H32 Z" fill="' + (col || '#ffd166') + '"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="28" cy="46" r="4.5" fill="#fff"' + S + '/>' + line('M28 46 Q18 30 10 34', INK, 1.8) + (extra || '');
  }
  function ring(cx, cy, r) { return ringAt(cx, cy, r, r); }

  var P = {
    /* ---------- World 3: My day ---------- */
    clock: svg('<circle cx="50" cy="52" r="34" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
      (function () { var t = ''; for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; t += '<circle cx="' + (50 + 27 * Math.sin(a)).toFixed(1) + '" cy="' + (52 - 27 * Math.cos(a)).toFixed(1) + '" r="' + (i % 3 ? 1.6 : 2.8) + '" fill="' + INK + '"/>'; } return t; })() +
      line('M50 52 V30', INK, 4) + line('M50 52 L36 62', '#ef476f', 4) + '<circle cx="50" cy="52" r="3.5" fill="' + INK + '"/>', '#e8f4ff'),
    day: svg('<rect width="100" height="100" rx="18" fill="#9fd4ff"/><circle cx="72" cy="28" r="13" fill="#ffd166" stroke="#f4a259" stroke-width="2"/>' +
      line('M72 8 v4 M72 44 v4 M52 28 h4 M88 28 h4 M58 14 l3 3 M83 39 l3 3 M86 14 l-3 3 M61 39 l-3 3', '#f4a259', 2.5) +
      cloudShape(8, 22, 0.5, '#fff') + '<path d="M0 70 Q30 56 60 68 Q80 62 100 66 V82 Q100 100 82 100 H18 Q0 100 0 82 Z" fill="#6cc070"/>' +
      '<rect x="22" y="58" width="6" height="16" fill="#8d5a3b"/><circle cx="25" cy="54" r="10" fill="#2bb673"/>'),
    night: svg('<rect width="100" height="100" rx="18" fill="#22305e"/><path d="M62 18 A26 26 0 1 0 82 62 A20 20 0 1 1 62 18 Z" fill="#ffe08a"/>' +
      star(24, 24, 6, '#fff3b0') + star(36, 70, 4, '#fff3b0') + star(80, 82, 5, '#fff3b0') + star(18, 52, 3.5, '#fff3b0')),
    today: svg(calendar('<rect x="37" y="57" width="11" height="9" rx="2" fill="#2bb673"/>' + ringAt(42.5, 61.5, 11, 10)), '#fff8e7'),
    tomorrow: svg(calendar('<rect x="37" y="57" width="11" height="9" rx="2" fill="#c9d3e3"/><rect x="52" y="57" width="11" height="9" rx="2" fill="#2bb673"/>' +
      line('M42 54 Q50 44 57 54', '#ef476f', 3) + '<path d="M54 50 L58 55 L52 56 Z" fill="#ef476f"/>'), '#fff8e7'),
    week: svg('<rect x="6" y="34" width="88" height="34" rx="8" fill="#fff"' + S + '/>' +
      ['#ef476f', '#f4a259', '#ffd166', '#2bb673', '#4ea8de', '#9b7ede', '#ff8fc7'].map(function (c, i) { return '<rect x="' + (10 + i * 12) + '" y="40" width="10" height="22" rx="3" fill="' + c + '"/>'; }).join('') +
      text(50, 84, '1 – 7', 13, '#5d6178'), '#f4f6fb'),
    wakeup: svg('<path d="M0 82 Q50 62 100 82 V100 H0 Z" fill="#9fd4ff"/><circle cx="80" cy="22" r="10" fill="#ffd166"/>' +
      kid({ hy: 34, body: [50, 46, 50, 70], arms: [[44, 50, 30, 30], [56, 50, 70, 30]], legs: [] }) +
      '<rect x="16" y="68" width="68" height="18" rx="6" fill="#4ea8de"' + S + '/>', '#fff8e7'),
    sleep: svg('<rect x="12" y="60" width="76" height="22" rx="8" fill="#9b7ede"' + S + '/><ellipse cx="34" cy="58" rx="18" ry="9" fill="#fff"' + S + '/>' +
      '<circle cx="36" cy="46" r="14" fill="' + SKIN + '"' + SK + '/>' + line('M28 46 q3 3 6 0 M38 46 q3 3 6 0', INK, 2) +
      text(66, 34, 'Z', 16, '#9b7ede') + text(78, 22, 'z', 12, '#9b7ede') + text(56, 44, 'z', 10, '#9b7ede'), '#eef0ff'),

    school: svg(building('<rect x="42" y="64" width="16" height="24" fill="#8d5a3b"' + S + '/><rect x="24" y="48" width="12" height="10" fill="#cdeafe"' + S + '/><rect x="64" y="48" width="12" height="10" fill="#cdeafe"' + S + '/>',
      '<path d="M12 40 L50 18 L88 40 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><circle cx="50" cy="31" r="5" fill="#fff"' + S + '/>' +
      line('M50 18 V4', INK, 2.5) + '<path d="M50 4 H64 L60 8 L64 12 H50 Z" fill="#2bb673"/>', '#ffd166'), '#e8f4ff'),
    teacher: svg('<rect x="40" y="16" width="54" height="38" rx="3" fill="#2f6f4f"' + S + '/>' + text(67, 41, 'A B C', 13, '#fff') +
      '<rect x="44" y="54" width="46" height="4" fill="#8d5a3b"/>' + person({ style: 'bun', hair: '#5a3b2a', shirt: '#9b7ede', glasses: true, s: 0.72, x: 28, y: 98 }) +
      line('M38 70 L54 40', '#8d5a3b', 2.5), '#f3efff'),
    pencil: svg('<g transform="rotate(-40 50 50)"><rect x="18" y="42" width="56" height="16" fill="#ffd166"' + S + '/><rect x="12" y="42" width="8" height="16" fill="#ff8fc7"' + S + '/>' +
      '<rect x="18" y="42" width="4" height="16" fill="#c9c9cf"/><path d="M74 42 L90 50 L74 58 Z" fill="#f3d6b0"' + S + ' stroke-linejoin="round"/><path d="M85 47.5 L90 50 L85 52.5 Z" fill="' + INK + '"/>' +
      line('M22 50 H74', '#e0b100', 1.5) + '</g>', '#fffbe6'),
    schoolbag: svg('<path d="M34 30 Q34 16 50 16 Q66 16 66 30" fill="none" stroke="' + INK + '" stroke-width="4"/><rect x="22" y="28" width="56" height="60" rx="14" fill="#ef476f"' + S + '/>' +
      '<rect x="32" y="56" width="36" height="24" rx="6" fill="#e03158"' + S + '/>' + line('M32 64 H68', INK, 1.5) + '<path d="M22 44 Q50 52 78 44" fill="none" stroke="' + INK + '" stroke-width="2"/>', '#fff0f3'),
    computer: svg('<rect x="20" y="22" width="60" height="42" rx="4" fill="' + INK + '"/><rect x="24" y="26" width="52" height="34" rx="2" fill="#4ea8de"/>' +
      '<path d="M10 70 H90 L84 80 H16 Z" fill="#c5ccd8"' + S + ' stroke-linejoin="round"/><rect x="42" y="72" width="16" height="3" rx="1.5" fill="#9aa3b5"/>' +
      '<rect x="30" y="34" width="20" height="4" rx="2" fill="#fff"/><rect x="30" y="42" width="32" height="4" rx="2" fill="#cdeafe"/>', '#eef6ff'),
    friend: svg(person({ style: 'short', hair: '#3b2a20', shirt: '#f4a259', s: 0.6, x: 32, y: 96 }) + person({ style: 'pigtails', hair: '#2f2a28', shirt: '#2bb673', s: 0.6, x: 68, y: 96, blush: true }) +
      line('M42 78 Q50 84 58 78', SKIN, 6), '#fff8e7'),
    doctor: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#ffffff', s: 0.95 }) + line('M40 62 Q40 78 50 80 Q60 78 60 62', INK, 2) + '<circle cx="50" cy="82" r="4" fill="#9aa3b5"' + S + '/>' +
      '<rect x="62" y="70" width="12" height="12" rx="2" fill="#fff"' + S + '/><path d="M66 76 h4 M68 74 v4" stroke="#e63946" stroke-width="2.5"/>', '#e3f4fb'),
    work: svg('<rect x="16" y="36" width="68" height="46" rx="8" fill="#8d5a3b"' + S + '/><path d="M38 36 V28 Q38 24 42 24 H58 Q62 24 62 28 V36" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
      line('M16 54 H84', INK, 2) + '<rect x="44" y="50" width="12" height="9" rx="2" fill="#ffd166"' + S + '/>', '#fdf0e6'),

    happy: svg(face(50, 52, 32) + line('M36 44 q4 -5 8 0 M56 44 q4 -5 8 0', INK, 3) + '<path d="M34 58 Q50 76 66 58 Z" fill="#fff" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<circle cx="30" cy="58" r="4" fill="#f29c9c"/><circle cx="70" cy="58" r="4" fill="#f29c9c"/>' + star(14, 20, 6) + star(86, 24, 5), '#fffbe6'),
    sad: svg(cloudShape(28, 2, 0.65, '#9aa3b5') + '<path d="M40 30 q-2 4 0 6 M50 32 q-2 4 0 6 M60 30 q-2 4 0 6" fill="none" stroke="#4ea8de" stroke-width="2.4" stroke-linecap="round"/>' +
      face(50, 64, 26, '#a9c8ff') + eyes(50, 60, 9, 3) + frown(50, 72, 8) + line('M37 52 l7 3 M63 52 l-7 3', INK, 2), '#eef2fb'),
    angry: svg(face(50, 54, 32, '#ff7b6b') + line('M30 38 L44 46 M70 38 L56 46', INK, 3.5) + eyes(50, 50, 10, 3.4) + line('M38 68 Q50 60 62 68', INK, 3) +
      line('M14 18 l8 6 M22 14 l2 9 M86 18 l-8 6 M78 14 l-2 9', '#e63946', 3), '#fff0ec'),
    scared: svg(face(50, 54, 32, '#d6f0ff') + '<circle cx="40" cy="48" r="6" fill="#fff"' + S + '/><circle cx="60" cy="48" r="6" fill="#fff"' + S + '/><circle cx="40" cy="48" r="2.5" fill="' + INK + '"/><circle cx="60" cy="48" r="2.5" fill="' + INK + '"/>' +
      line('M36 68 q4 -4 7 0 q4 4 7 0 q4 -4 7 0', INK, 2.4) + '<path d="M78 34 q-4 8 0 11 q4 -3 0 -11 Z" fill="#4ea8de"/>' + line('M30 36 l8 -4 M70 36 l-8 -4', INK, 2.4), '#eef8ff'),
    tired: svg(face(50, 54, 32) + line('M34 48 h12 M54 48 h12', INK, 3) + '<ellipse cx="50" cy="68" rx="7" ry="9" fill="#7a3b3b"' + S + '/>' +
      '<path d="M32 50 q2 5 5 5" fill="none" stroke="#9aa3b5" stroke-width="2"/>' + text(84, 26, 'z', 14, '#9b7ede') + text(74, 16, 'z', 10, '#9b7ede'), '#fffbe6'),
    hungry: svg(face(42, 40, 24) + eyes(42, 36, 8, 2.6) + '<ellipse cx="42" cy="50" rx="6" ry="7" fill="#7a3b3b"' + S + '/>' +
      '<ellipse cx="54" cy="80" rx="34" ry="9" fill="#fff"' + S + '/><ellipse cx="54" cy="79" rx="22" ry="5" fill="#e7ecf5"/>' + line('M84 22 V46 M80 22 V32 M88 22 V32 M80 32 Q84 36 88 32', '#9aa3b5', 2.5), '#fff4e6'),
    surprised: svg(face(50, 54, 32) + line('M34 34 q6 -6 12 0 M54 34 q6 -6 12 0', INK, 2.6) + '<circle cx="40" cy="46" r="5" fill="#fff"' + S + '/><circle cx="60" cy="46" r="5" fill="#fff"' + S + '/>' +
      '<circle cx="40" cy="46" r="2.2" fill="' + INK + '"/><circle cx="60" cy="46" r="2.2" fill="' + INK + '"/><ellipse cx="50" cy="68" rx="7" ry="9" fill="#7a3b3b"' + S + '/>' +
      text(84, 28, '!', 22, '#ef476f'), '#fffbe6'),
    laugh: svg(face(50, 52, 32) + line('M33 44 l8 4 l-8 4 M67 44 l-8 4 l8 4', INK, 2.6) + '<path d="M30 58 Q50 86 70 58 Z" fill="#7a3b3b" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M36 60 H64 L62 64 H38 Z" fill="#fff"/><path d="M22 52 q-6 6 -2 10 q4 0 2 -10 Z M78 52 q6 6 2 10 q-4 0 -2 -10 Z" fill="#4ea8de"/>', '#fffbe6'),

    ball: svg('<circle cx="50" cy="52" r="32" fill="#fff"' + S + '/><path d="M50 20 A32 32 0 0 1 82 52 L50 52 Z" fill="#ef476f"/><path d="M50 84 A32 32 0 0 1 18 52 L50 52 Z" fill="#4ea8de"/>' +
      '<path d="M18 52 A32 32 0 0 1 50 20 L50 52 Z" fill="#ffd166"/><circle cx="50" cy="52" r="32" fill="none"' + S + '/><circle cx="50" cy="52" r="6" fill="#fff"' + S + '/>', '#e8f4ff'),
    doll: svg('<path d="M30 40 Q28 16 50 16 Q72 16 70 40 L72 56 L28 56 Z" fill="#ffd23f"' + S + '/><circle cx="50" cy="38" r="15" fill="' + SKIN + '"' + SK + '/>' +
      '<path d="M36 34 Q50 20 64 34 Q58 26 50 26 Q42 26 36 34 Z" fill="#ffd23f"/>' + '<circle cx="45" cy="38" r="2" fill="' + INK + '"/><circle cx="55" cy="38" r="2" fill="' + INK + '"/>' + smile(50, 43, 3) +
      '<circle cx="41" cy="44" r="2.2" fill="#f29c9c"/><circle cx="59" cy="44" r="2.2" fill="#f29c9c"/><path d="M38 54 L28 90 H72 L62 54 Z" fill="#ff8fc7"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M32 74 H68" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><path d="M64 18 l6 -6 l2 8 Z" fill="#ef476f"/>', '#fff0f3'),
    teddy: svg('<circle cx="34" cy="20" r="9" fill="#b07a4f"' + S + '/><circle cx="66" cy="20" r="9" fill="#b07a4f"' + S + '/><ellipse cx="50" cy="72" rx="24" ry="22" fill="#b07a4f"' + S + '/>' +
      '<ellipse cx="50" cy="74" rx="13" ry="12" fill="#e2b48a"/><circle cx="50" cy="36" r="20" fill="#b07a4f"' + S + '/><ellipse cx="50" cy="42" rx="9" ry="7" fill="#e2b48a"/>' +
      eyes(50, 32, 7, 2.6) + '<ellipse cx="50" cy="40" rx="3.5" ry="2.5" fill="' + INK + '"/><circle cx="26" cy="66" r="7" fill="#b07a4f"' + S + '/><circle cx="74" cy="66" r="7" fill="#b07a4f"' + S + '/>' +
      '<path d="M44 54 L50 58 L56 54 L56 62 L50 58 L44 62 Z" fill="#ef476f"/>', '#fdf0e6'),
    kite: svg('<path d="M58 10 L82 34 L58 62 L34 34 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><path d="M58 10 V62 M34 34 H82" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<path d="M58 10 L82 34 L58 34 Z" fill="#ffd166"/><path d="M34 34 L58 62 V34 Z" fill="#4ea8de"/><path d="M58 10 L82 34 L58 62 L34 34 Z" fill="none"' + S + '/>' +
      line('M58 62 Q48 74 36 72 Q24 70 18 86', INK, 1.8) + '<path d="M42 70 l-4 -5 l-2 7 Z M28 76 l-5 -3 l1 7 Z" fill="#2bb673"/>', '#e8f4ff'),
    blocks: svg('<rect x="14" y="56" width="32" height="32" rx="4" fill="#ef476f"' + S + '/>' + text(30, 79, 'A', 20, '#fff') +
      '<rect x="50" y="56" width="32" height="32" rx="4" fill="#4ea8de"' + S + '/>' + text(66, 79, 'B', 20, '#fff') +
      '<rect x="32" y="22" width="32" height="32" rx="4" fill="#2bb673"' + S + '/>' + text(48, 45, 'C', 20, '#fff'), '#fff8e7'),
    car: svg('<path d="M12 64 V54 Q12 48 18 48 H28 L38 34 H64 L76 48 H84 Q90 48 90 56 V64 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M42 38 H52 V48 H34 Z M56 38 H63 L72 48 H56 Z" fill="#cdeafe"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="30" cy="66" r="9" fill="' + INK + '"/><circle cx="30" cy="66" r="4" fill="#c5ccd8"/><circle cx="72" cy="66" r="9" fill="' + INK + '"/><circle cx="72" cy="66" r="4" fill="#c5ccd8"/>' +
      '<rect x="84" y="52" width="6" height="5" rx="1" fill="#ffd166"/>', '#fff0f3'),
    drum: svg('<ellipse cx="50" cy="44" rx="30" ry="10" fill="#fff"' + S + '/><path d="M20 44 V74 Q50 90 80 74 V44 Q50 58 20 44 Z" fill="#ef476f"' + S + '/>' +
      line('M22 50 L34 80 L50 52 L66 82 L78 50', '#ffd166', 2.5) + line('M28 14 L46 40 M74 12 L56 40', '#8d5a3b', 3.5) + '<circle cx="28" cy="14" r="4" fill="#fff"' + S + '/><circle cx="74" cy="12" r="4" fill="#fff"' + S + '/>', '#fff8e7'),
    paint: svg('<path d="M22 54 Q14 30 40 22 Q72 12 84 36 Q90 52 74 56 Q64 58 64 68 Q64 82 46 82 Q28 82 22 54 Z" fill="#f3d6b0"' + S + '/><circle cx="40" cy="64" r="7" fill="#fff"' + S + '/>' +
      '<circle cx="34" cy="38" r="6" fill="#ef476f"/><circle cx="50" cy="30" r="6" fill="#ffd166"/><circle cx="66" cy="32" r="6" fill="#2bb673"/><circle cx="74" cy="46" r="6" fill="#4ea8de"/>' +
      line('M88 14 L56 54', '#8d5a3b', 4) + '<path d="M58 50 L52 60 L50 52 Z" fill="#9b7ede"' + S + '/>', '#fffbe6'),

    football: svg('<path d="M10 62 V24 H70" fill="none" stroke="#fff" stroke-width="4"/>' + '<path d="M14 26 H66 M14 36 H66 M14 46 H66 M14 56 H66 M22 26 V62 M34 26 V62 M46 26 V62 M58 26 V62" stroke="#ffffff" stroke-width="1" opacity="0.8"/>' +
      '<rect width="100" height="22" y="78" fill="#3e9a4a"/><circle cx="64" cy="68" r="20" fill="#fff"' + S + '/>' +
      '<path d="M64 60 L71 65 L68 73 L60 73 L57 65 Z" fill="' + INK + '"/>' + line('M64 60 V48 M71 65 L82 61 M68 73 L74 83 M60 73 L54 83 M57 65 L46 61', INK, 1.5), '#cfe9d3'),
    basketball: svg('<rect x="46" y="10" width="44" height="30" rx="3" fill="#fff"' + S + '/><rect x="58" y="22" width="20" height="14" fill="none" stroke="#ef476f" stroke-width="2"/>' +
      '<path d="M54 40 H82" stroke="#ff8c1a" stroke-width="4"/><path d="M56 40 L60 56 H76 L80 40 M62 40 L64 56 M68 40 V56 M74 40 L72 56" fill="none" stroke="#9aa3b5" stroke-width="1.5"/>' +
      '<circle cx="34" cy="66" r="20" fill="#ff8c1a"' + S + '/>' + line('M14 66 H54 M34 46 V86 M20 52 Q30 66 20 80 M48 52 Q38 66 48 80', INK, 1.8), '#fff4e6'),
    tennis: svg('<g transform="rotate(-35 46 46)"><ellipse cx="46" cy="36" rx="22" ry="26" fill="#fff" stroke="#ef476f" stroke-width="5"/>' +
      line('M32 22 H60 M28 30 H64 M27 38 H65 M29 46 H63 M34 54 H58 M38 14 V58 M46 10 V62 M54 14 V58', '#9aa3b5', 1.2) +
      '<rect x="42" y="62" width="8" height="30" rx="3" fill="' + INK + '"/></g><circle cx="78" cy="74" r="11" fill="#d7f04a"' + S + '/>' + line('M68 70 Q78 76 88 70', '#fff', 2), '#eafaf1'),
    swim: svg('<rect y="56" width="100" height="44" fill="#4ea8de"/>' + '<circle cx="46" cy="50" r="11" fill="' + SKIN + '"' + SK + '/><path d="M35 46 Q46 34 57 46 Z" fill="#ef476f"/>' +
      eyes(46, 51, 4, 1.6) + line('M58 54 Q70 34 82 42', SKIN, 7) + line('M0 60 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0', '#fff', 3) + line('M0 76 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0', '#bfe3ff', 3), '#e3f4fb'),
    run: svg(kid({ hx: 56, hy: 22, look: 2, body: [52, 36, 46, 58], arms: [[50, 40, 64, 50], [50, 40, 36, 30]], legs: [[46, 58, 62, 74], [46, 58, 34, 80]], shirt: '#ef476f' }) +
      line('M12 40 H26 M8 52 H22 M14 64 H28', '#9aa3b5', 3), '#fff0f3'),
    bike: svg('<circle cx="26" cy="66" r="16" fill="none" stroke="' + INK + '" stroke-width="4"/><circle cx="74" cy="66" r="16" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
      line('M26 66 L42 44 H66 L74 66 M42 44 L50 66 L66 44 M50 66 H26', '#2bb673', 4) + line('M38 38 H48 M66 44 L62 32 H72', INK, 3.5), '#eafaf1'),
    jump: svg(kid({ hy: 22, body: [50, 34, 50, 56], arms: [[46, 38, 30, 20], [54, 38, 70, 20]], legs: [[48, 56, 38, 68], [52, 56, 62, 68]], shirt: '#9b7ede' }) +
      '<ellipse cx="50" cy="90" rx="20" ry="4" fill="#000" opacity="0.12"/>' + line('M22 76 v6 M78 76 v6 M30 84 v4 M70 84 v4', '#9aa3b5', 2.5), '#f3efff'),
    medal: svg('<path d="M30 8 H46 L56 40 H40 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><path d="M70 8 H54 L44 40 H60 Z" fill="#4ea8de"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="50" cy="62" r="24" fill="#ffd166" stroke="#d9a10f" stroke-width="3"/><circle cx="50" cy="62" r="17" fill="none" stroke="#d9a10f" stroke-width="2"/>' + star(50, 62, 11, '#fff1b3'), '#fffbe6'),

    /* ---------- World 4: Out and about ---------- */
    money: svg('<rect x="10" y="30" width="70" height="40" rx="5" fill="#8fd18f"' + S + ' transform="rotate(-8 45 50)"/><rect x="20" y="38" width="70" height="40" rx="5" fill="#6cc070"' + S + '/>' +
      '<circle cx="55" cy="58" r="11" fill="#bfe9bf"' + S + '/>' + text(55, 64, '$', 16, '#2b6b2b') + '<circle cx="28" cy="46" r="3" fill="#bfe9bf"/><circle cx="82" cy="70" r="3" fill="#bfe9bf"/>', '#eafaf1'),
    shop: svg('<rect x="16" y="40" width="68" height="48" fill="#fff"' + S + '/><path d="M12 26 H88 L84 42 H16 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M24 26 L22 42 M38 26 L37 42 M50 26 V42 M62 26 L63 42 M76 26 L78 42" stroke="#fff" stroke-width="5"/>' + '<path d="M16 42 Q22 48 28 42 Q34 48 40 42 Q46 48 52 42 Q58 48 64 42 Q70 48 76 42 Q82 48 84 42" fill="#ef476f"' + S + '/>' +
      '<rect x="24" y="54" width="24" height="18" fill="#cdeafe"' + S + '/><rect x="56" y="54" width="20" height="34" fill="#8d5a3b"' + S + '/><circle cx="72" cy="72" r="1.8" fill="#ffd166"/>', '#fff8e7'),
    basket: svg('<path d="M30 40 Q30 14 50 14 Q70 14 70 40" fill="none" stroke="' + INK + '" stroke-width="4"/><path d="M14 40 H86 L78 84 H22 Z" fill="#e2a35f"' + S + ' stroke-linejoin="round"/>' +
      line('M18 54 H82 M20 68 H80 M34 40 L36 84 M50 40 V84 M66 40 L64 84', '#a8692c', 2) + '<circle cx="36" cy="34" r="8" fill="#e63946"' + S + '/><path d="M54 36 Q60 22 70 30 Q64 38 54 36 Z" fill="#ffd23f"' + S + '/>', '#fff4e6'),
    trolley: svg('<path d="M8 22 H20 L30 64 H78" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 30 H86 L78 56 H28 Z" fill="#4ea8de"' + S + ' stroke-linejoin="round"/>' +
      line('M40 30 L42 56 M56 30 V56 M72 30 L70 56 M24 43 H82', '#2b7fc0', 1.8) + '<circle cx="36" cy="76" r="7" fill="' + INK + '"/><circle cx="72" cy="76" r="7" fill="' + INK + '"/>', '#eef6ff'),
    buy: svg('<path d="M58 34 H88 L84 84 H62 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><path d="M66 34 Q66 22 73 22 Q80 22 80 34" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<g fill="' + SKIN + '"' + SK + '><rect x="10" y="54" width="30" height="20" rx="8"/><rect x="32" y="56" width="16" height="7" rx="3.5"/></g><circle cx="46" cy="48" r="9" fill="#ffc93c" stroke="#d9a10f" stroke-width="2"/>' +
      line('M48 70 L56 70', INK, 2.5) + '<path d="M54 66 L60 70 L54 74 Z" fill="' + INK + '"/>', '#fff0f3'),
    cheap: svg(tag(text(60, 55, '$', 24, '#1f8a56'), '#c8f0d6') + '<path d="M60 74 V94 M51 85 L60 94 L69 85" fill="none" stroke="#1f8a56" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>', '#eafaf1'),
    expensive: svg(tag(text(60, 54, '$$$', 20, '#b8302a'), '#ffd6d1') + '<path d="M60 94 V74 M51 83 L60 74 L69 83" fill="none" stroke="#b8302a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>', '#fff0ec'),
    price: svg(tag(text(60, 58, '?', 30, INK)), '#fffbe6'),

    bus: svg('<rect x="10" y="24" width="80" height="50" rx="10" fill="#ffd23f"' + S + '/><rect x="16" y="32" width="16" height="14" rx="2" fill="#cdeafe"' + S + '/><rect x="36" y="32" width="16" height="14" rx="2" fill="#cdeafe"' + S + '/><rect x="56" y="32" width="16" height="14" rx="2" fill="#cdeafe"' + S + '/>' +
      '<rect x="76" y="32" width="10" height="30" rx="2" fill="#cdeafe"' + S + '/>' + line('M10 54 H76', INK, 2) + '<circle cx="28" cy="76" r="8" fill="' + INK + '"/><circle cx="72" cy="76" r="8" fill="' + INK + '"/>', '#fffbe6'),
    train: svg('<rect x="14" y="30" width="44" height="40" rx="4" fill="#e63946"' + S + '/><rect x="56" y="44" width="30" height="26" rx="4" fill="#e63946"' + S + '/><rect x="20" y="36" width="30" height="16" rx="2" fill="#cdeafe"' + S + '/>' +
      '<rect x="68" y="30" width="10" height="14" fill="' + INK + '"/><circle cx="74" cy="20" r="6" fill="#d0d4dc"/><circle cx="82" cy="12" r="4" fill="#e5e7ec"/>' +
      '<circle cx="28" cy="74" r="8" fill="' + INK + '"/><circle cx="50" cy="74" r="8" fill="' + INK + '"/><circle cx="74" cy="74" r="8" fill="' + INK + '"/>' + line('M6 86 H94', '#8d5a3b', 3), '#fdecee'),
    plane: svg('<path d="M10 52 Q10 44 20 44 H74 Q90 44 92 52 Q90 60 74 60 H20 Q10 60 10 52 Z" fill="#fff"' + S + '/><path d="M40 46 L56 18 H64 L58 46 Z M40 58 L56 84 H64 L58 58 Z" fill="#4ea8de"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M14 46 L10 30 H18 L28 46 Z" fill="#4ea8de"' + S + ' stroke-linejoin="round"/><circle cx="70" cy="51" r="2.5" fill="#4ea8de"/><circle cx="62" cy="51" r="2.5" fill="#4ea8de"/><circle cx="78" cy="51" r="2.5" fill="#4ea8de"/>', '#e8f4ff'),
    boat: svg('<rect y="70" width="100" height="30" fill="#4ea8de"/><path d="M14 66 H86 L76 80 H24 Z" fill="#8d5a3b"' + S + ' stroke-linejoin="round"/>' + line('M50 66 V12', INK, 3) +
      '<path d="M52 14 L80 60 H52 Z" fill="#fff"' + S + ' stroke-linejoin="round"/><path d="M48 22 L26 60 H48 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/>' + line('M0 86 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0', '#fff', 2.5), '#e8f4ff'),
    taxi: svg('<rect x="36" y="18" width="28" height="12" rx="3" fill="' + INK + '"/>' + text(50, 27.5, 'TAXI', 8.5, '#ffd23f') +
      '<path d="M10 68 V58 Q10 52 16 52 H24 L34 36 H66 L76 52 H84 Q90 52 90 60 V68 Z" fill="#ffd23f"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M38 40 H48 V52 H30 Z M52 40 H62 L70 52 H52 Z" fill="#cdeafe"' + S + ' stroke-linejoin="round"/>' + '<path d="M10 60 H90" stroke="' + INK + '" stroke-width="5" stroke-dasharray="5 5"/>' +
      '<circle cx="28" cy="70" r="9" fill="' + INK + '"/><circle cx="72" cy="70" r="9" fill="' + INK + '"/>', '#fffbe6'),
    walk: svg(kid({ hy: 22, body: [50, 34, 50, 58], arms: [[48, 38, 40, 54], [52, 38, 60, 52]], legs: [[49, 58, 42, 82], [51, 58, 60, 82]], shirt: '#2bb673' }) +
      '<ellipse cx="22" cy="88" rx="4" ry="6" fill="#c9c9cf"/><ellipse cx="80" cy="84" rx="4" ry="6" fill="#c9c9cf"/>', '#eafaf1'),
    left: svg(arrowShape('left', '#4ea8de'), '#e8f4ff'),
    right: svg(arrowShape('right', '#ef476f'), '#fff0f3'),

    restaurant: svg(building('<rect x="42" y="64" width="16" height="24" fill="#8d5a3b"' + S + '/><rect x="24" y="48" width="14" height="12" fill="#cdeafe"' + S + '/><rect x="62" y="48" width="14" height="12" fill="#cdeafe"' + S + '/>',
      '<rect x="14" y="24" width="72" height="16" rx="4" fill="#2bb673"' + S + '/>' + line('M40 28 V36 M37 28 V32 Q40 34 43 32 V28 M58 28 Q63 30 60 36', '#fff', 2)), '#fff8e7'),
    menu: svg('<rect x="22" y="12" width="56" height="78" rx="6" fill="#fff"' + S + '/><rect x="22" y="12" width="56" height="16" rx="6" fill="#ef476f"' + S + '/>' +
      '<rect x="30" y="38" width="30" height="4" rx="2" fill="#c5ccd8"/><rect x="30" y="50" width="38" height="4" rx="2" fill="#c5ccd8"/><rect x="30" y="62" width="26" height="4" rx="2" fill="#c5ccd8"/><rect x="30" y="74" width="34" height="4" rx="2" fill="#c5ccd8"/>' +
      '<circle cx="66" cy="40" r="2.5" fill="#ef476f"/><circle cx="74" cy="52" r="2.5" fill="#ef476f"/>', '#fff0f3'),
    chopsticks: svg(line('M24 14 L60 76', '#a8692c', 5) + line('M36 10 L66 74', '#c98a4b', 5) + '<ellipse cx="66" cy="80" rx="16" ry="10" fill="#fff7ea"' + S + '/>' + line('M54 78 q6 -6 12 0 q6 -6 12 0', '#e0c9a6', 2), '#fdf0e6'),
    spoon: svg('<g transform="rotate(30 50 50)"><ellipse cx="50" cy="30" rx="16" ry="20" fill="#d0d4dc"' + S + '/><ellipse cx="46" cy="26" rx="5" ry="9" fill="#fff" opacity="0.7"/><rect x="46" y="48" width="8" height="42" rx="4" fill="#d0d4dc"' + S + '/></g>', '#f4f6fb'),
    fork: svg('<g transform="rotate(30 50 50)"><path d="M34 12 V34 Q34 44 46 46 V88 Q46 92 50 92 Q54 92 54 88 V46 Q66 44 66 34 V12" fill="#d0d4dc"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M42 12 V32 M50 12 V32 M58 12 V32" stroke="' + INK + '" stroke-width="2"/></g>', '#f4f6fb'),
    cup: svg('<path d="M22 30 H70 V70 Q70 84 56 84 H36 Q22 84 22 70 Z" fill="#4ea8de"' + S + '/><path d="M70 40 Q86 40 86 54 Q86 66 70 66" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
      '<ellipse cx="46" cy="30" rx="24" ry="4" fill="#8d5a3b"' + S + '/>' + line('M36 20 q-4 -6 0 -10 M48 20 q-4 -6 0 -10 M60 20 q-4 -6 0 -10', '#9aa3b5', 2.4), '#eef6ff'),
    icecream: svg('<path d="M34 50 L50 92 L66 50 Z" fill="#e2a35f"' + S + ' stroke-linejoin="round"/>' + line('M40 56 L58 74 M48 52 L62 66 M60 54 L44 74', '#a8692c', 1.5) +
      '<circle cx="50" cy="40" r="17" fill="#ff8fc7"' + S + '/><circle cx="50" cy="20" r="6" fill="#e63946"' + S + '/>' + '<path d="M36 46 q4 6 8 0 q4 6 8 0 q4 6 8 0" fill="#ff8fc7" stroke="' + INK + '" stroke-width="1.5"/>', '#fff0f3'),
    delicious: svg(face(50, 52, 32) + '<path d="M34 42 C30 34 40 32 41 40 C42 32 52 34 48 42 L41 50 Z" fill="#ef476f"/><path d="M52 42 C48 34 58 32 59 40 C60 32 70 34 66 42 L59 50 Z" fill="#ef476f"/>' +
      '<path d="M36 62 Q50 74 64 62" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/><path d="M54 66 Q60 76 66 66 Z" fill="#ff7b9b"' + S + '/>', '#fffbe6'),

    park: svg('<rect y="74" width="100" height="26" fill="#6cc070"/><rect x="24" y="44" width="8" height="32" fill="#8d5a3b"/><circle cx="28" cy="34" r="20" fill="#2bb673"' + S + '/>' +
      '<rect x="50" y="62" width="40" height="6" rx="2" fill="#c98a4b"' + S + '/><rect x="50" y="52" width="40" height="5" rx="2" fill="#c98a4b"' + S + '/>' + line('M54 68 V78 M86 68 V78', INK, 3) +
      '<circle cx="76" cy="20" r="8" fill="#ffd166"/>', '#cdeafe'),
    hospital: svg(building('<rect x="42" y="66" width="16" height="22" fill="#cdeafe"' + S + '/><rect x="24" y="72" width="12" height="10" fill="#cdeafe"' + S + '/><rect x="64" y="72" width="12" height="10" fill="#cdeafe"' + S + '/>' +
      '<rect x="38" y="44" width="24" height="24" rx="4" fill="#e63946"/><path d="M50 49 V63 M43 56 H57" stroke="#fff" stroke-width="5"/>', '', '#fff'), '#e3f4fb'),
    library: svg('<rect x="12" y="14" width="76" height="76" rx="4" fill="#c98a4b"' + S + '/>' + line('M12 38 H88 M12 62 H88', INK, 3) +
      (function () { var b = '', cols = ['#ef476f', '#4ea8de', '#ffd166', '#2bb673', '#9b7ede', '#f4a259']; for (var r = 0; r < 3; r++) for (var i = 0; i < 6; i++) b += '<rect x="' + (16 + i * 12) + '" y="' + (18 + r * 24 + (i % 2) * 2) + '" width="9" height="' + (18 - (i % 2) * 2) + '" fill="' + cols[(i + r) % 6] + '" stroke="' + INK + '" stroke-width="1"/>'; return b; })(), '#fdf0e6'),
    zoo: svg('<rect y="66" width="100" height="34" fill="#6cc070"/><path d="M40 90 V40 Q40 32 46 30 L56 14 Q60 10 64 14 L66 24 Q70 30 62 34 Q54 38 54 46 V90 Z" fill="#ffc94a"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="46" cy="52" r="3" fill="#c9821f"/><circle cx="50" cy="66" r="3.5" fill="#c9821f"/><circle cx="45" cy="78" r="3" fill="#c9821f"/><circle cx="60" cy="20" r="1.8" fill="' + INK + '"/>' +
      line('M58 12 L56 6 M62 12 L64 6', INK, 2) + line('M6 60 H94 M6 76 H94 M14 56 V90 M86 56 V90', '#8d5a3b', 3), '#e8f4ff'),
    cinema: svg('<rect x="10" y="16" width="80" height="44" rx="4" fill="' + INK + '"/><rect x="14" y="20" width="72" height="36" rx="2" fill="#4ea8de"/>' + star(50, 38, 10, '#ffd166') +
      '<path d="M30 92 L26 66 H54 L50 92 Z" fill="#fff" stroke="#e63946" stroke-width="2"/><path d="M30 66 L32 92 M38 66 V92 M46 66 L44 92" stroke="#e63946" stroke-width="3"/>' +
      '<circle cx="32" cy="62" r="6" fill="#fff4c4"' + S + '/><circle cx="42" cy="60" r="6" fill="#fff4c4"' + S + '/><circle cx="50" cy="63" r="5" fill="#fff4c4"' + S + '/>', '#f3efff'),
    beach: svg('<rect width="100" height="56" fill="#9fd4ff"/><rect y="50" width="100" height="16" fill="#4ea8de"/><path d="M0 64 Q50 56 100 64 V100 H0 Z" fill="#ffe3a3"/>' +
      line('M60 92 L44 36', INK, 2.5) + '<path d="M22 44 Q40 18 66 30 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><circle cx="16" cy="18" r="8" fill="#ffd166"/>' + '<circle cx="80" cy="82" r="7" fill="#ffd166"' + S + '/>'),
    toilet: svg('<rect x="58" y="14" width="24" height="40" rx="4" fill="#fff"' + S + '/><path d="M18 46 H82 Q82 70 62 72 L66 90 H34 L38 72 Q18 70 18 46 Z" fill="#fff"' + S + ' stroke-linejoin="round"/>' +
      '<ellipse cx="50" cy="46" rx="32" ry="7" fill="#e7ecf5"' + S + '/><rect x="64" y="20" width="10" height="4" rx="2" fill="#9aa3b5"/>', '#eef6ff'),
    farm: svg('<rect y="76" width="100" height="24" fill="#6cc070"/><path d="M18 46 L50 22 L82 46 V86 H18 Z" fill="#d63a3a"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M10 50 L50 18 L90 50" fill="none" stroke="#fff" stroke-width="4"/><rect x="38" y="58" width="24" height="28" fill="#fff"' + S + '/>' + line('M38 58 L62 86 M62 58 L38 86', '#d63a3a', 3) +
      '<rect x="44" y="36" width="12" height="10" fill="#fff"' + S + '/>', '#e8f4ff'),

    suitcase: svg('<path d="M38 28 V20 Q38 16 42 16 H58 Q62 16 62 20 V28" fill="none" stroke="' + INK + '" stroke-width="4"/><rect x="16" y="28" width="68" height="56" rx="8" fill="#4ea8de"' + S + '/>' +
      line('M34 28 V84 M66 28 V84', '#2b7fc0', 4) + '<circle cx="28" cy="46" r="6" fill="#ffd166"/><rect x="46" y="58" width="16" height="10" rx="2" fill="#ef476f" transform="rotate(-12 54 63)"/>' +
      '<circle cx="28" cy="88" r="4" fill="' + INK + '"/><circle cx="72" cy="88" r="4" fill="' + INK + '"/>', '#e8f4ff'),
    passport: svg('<rect x="24" y="12" width="52" height="76" rx="6" fill="#1f3c88"' + S + '/><circle cx="50" cy="44" r="14" fill="none" stroke="#ffd166" stroke-width="2.5"/>' +
      '<path d="M36 44 H64 M50 30 V58 M40 34 Q50 44 40 54 M60 34 Q50 44 60 54" fill="none" stroke="#ffd166" stroke-width="1.8"/><rect x="34" y="68" width="32" height="5" rx="2" fill="#ffd166"/>', '#eef2fb'),
    hotel: svg('<rect x="22" y="14" width="56" height="76" rx="3" fill="#9b7ede"' + S + '/>' +
      (function () { var w = ''; for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) w += '<rect x="' + (28 + c * 17) + '" y="' + (32 + r * 12) + '" width="10" height="7" rx="1" fill="#fff6c4"/>'; return w; })() +
      '<rect x="30" y="16" width="40" height="12" rx="2" fill="#fff"' + S + '/>' + text(50, 25.5, 'HOTEL', 8.5, '#9b7ede') + '<rect x="42" y="78" width="16" height="12" fill="#5b3fa0"/>', '#f3efff'),
    map: svg('<path d="M10 24 L36 16 L64 24 L90 16 V78 L64 86 L36 78 L10 86 Z" fill="#fff4c4"' + S + ' stroke-linejoin="round"/><path d="M36 16 V78 M64 24 V86" stroke="' + INK + '" stroke-width="1.5"/>' +
      line('M18 70 Q30 50 46 56 T74 40', '#ef476f', 2.5) + '<path d="M70 34 l8 8 M78 34 l-8 8" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/><path d="M14 30 Q24 36 20 46 Q30 42 32 30 Z" fill="#6cc070"/>', '#e8f4ff'),
    camera: svg('<rect x="12" y="30" width="76" height="52" rx="8" fill="' + INK + '"/><path d="M34 30 L40 20 H60 L66 30 Z" fill="' + INK + '"/>' +
      '<circle cx="50" cy="56" r="17" fill="#9aa3b5" stroke="#fff" stroke-width="3"/><circle cx="50" cy="56" r="9" fill="#2b7fc0"/><circle cx="46" cy="52" r="3" fill="#fff" opacity="0.8"/>' +
      '<rect x="70" y="36" width="10" height="6" rx="2" fill="#ffd166"/>', '#f4f6fb'),
    ticket: svg('<path d="M10 32 H90 V44 Q82 44 82 52 Q82 60 90 60 V72 H10 V60 Q18 60 18 52 Q18 44 10 44 Z" fill="#ffd166"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M66 34 V70" stroke="' + INK + '" stroke-width="2" stroke-dasharray="4 4"/>' + star(38, 52, 10, '#ef476f') + '<rect x="72" y="44" width="10" height="16" rx="2" fill="#f4a259"/>', '#fffbe6'),
    sea: svg('<rect width="100" height="40" rx="18" fill="#cdeafe"/><rect y="34" width="100" height="66" fill="#2b7fc0"/>' +
      line('M0 46 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0', '#fff', 3) + line('M0 64 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0', '#9fd4ff', 3) + line('M0 82 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0', '#9fd4ff', 3) +
      '<path d="M70 24 q6 -6 12 0" fill="none" stroke="' + INK + '" stroke-width="2"/><path d="M58 18 q5 -5 10 0" fill="none" stroke="' + INK + '" stroke-width="2"/>'),
    holiday: svg('<path d="M0 82 Q50 70 100 82 V100 H0 Z" fill="#ffe3a3"/>' + line('M40 84 Q46 56 40 30', '#8d5a3b', 5) +
      '<path d="M40 30 Q22 22 12 34 Q28 28 40 32 Q30 14 44 10 Q42 22 42 30 Q56 16 70 24 Q54 24 42 32 Q62 32 66 46 Q52 34 40 32 Z" fill="#2bb673"' + S + ' stroke-linejoin="round"/>' +
      '<g transform="translate(58 58)"><rect x="0" y="0" width="14" height="10" rx="5" fill="' + INK + '"/><rect x="18" y="0" width="14" height="10" rx="5" fill="' + INK + '"/>' + line('M14 4 H18 M0 3 L-6 0 M32 3 L38 0', INK, 2) + '</g>', '#cdeafe'),

    /* ---------- World 5: Visiting family ---------- */
    uncle: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#2bb673', moustache: true }), '#eafaf1'),
    aunt: svg(person({ style: 'long', hair: '#7a3b2a', shirt: '#9b7ede', blush: true }) + '<circle cx="32" cy="52" r="3" fill="#ffd166"' + S + '/><circle cx="68" cy="52" r="3" fill="#ffd166"' + S + '/>', '#f3efff'),
    cousin: svg(person({ style: 'short', hair: '#3b2a20', shirt: '#ff8c1a', s: 0.9 }) + '<path d="M33 30 Q50 14 67 30 L80 32 Q78 36 66 36 Q50 26 34 36 Z" fill="#4ea8de"' + S + '/>', '#fff4e6'),
    littlebrother: svg(person({ style: 'short', hair: '#3b2a20', shirt: '#f4a259', s: 0.7, x: 32, y: 96 }) + person({ style: 'curl', hair: '#3b2a20', shirt: '#4ea8de', s: 0.5, x: 72, y: 96 }) + ring(72, 74, 20), '#e8f4ff'),
    littlesister: svg(person({ style: 'pigtails', hair: '#3b2a20', shirt: '#ffd166', s: 0.7, x: 32, y: 96, blush: true }) + person({ style: 'pigtails', hair: '#5a3b2a', shirt: '#ff8fc7', s: 0.5, x: 72, y: 96, blush: true }) + ring(72, 74, 20), '#fff0f3'),
    son: svg(person({ style: 'long', hair: '#5a3b2a', shirt: '#ef476f', s: 0.8, x: 34, y: 98 }) + person({ style: 'short', hair: '#3b2a20', shirt: '#4ea8de', s: 0.55, x: 74, y: 98 }) + ring(74, 74, 22), '#e8f4ff'),
    daughter: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#1d6fd1', s: 0.8, x: 34, y: 98 }) + person({ style: 'pigtails', hair: '#3b2a20', shirt: '#ff8fc7', s: 0.55, x: 74, y: 98, blush: true }) + ring(74, 74, 22), '#fff0f3'),
    parents: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#1d6fd1', s: 0.72, x: 30, y: 96 }) + person({ style: 'long', hair: '#5a3b2a', shirt: '#ef476f', s: 0.72, x: 70, y: 96, blush: true }) +
      '<path d="M50 20 C45 15 39 20 43 25 L50 32 L57 25 C61 20 55 15 50 20 Z" fill="#ef476f"/>', '#fff8e7'),

    kitchen: svg('<rect x="14" y="40" width="72" height="48" rx="4" fill="#fff"' + S + '/><rect x="14" y="40" width="72" height="10" fill="#c5ccd8"' + S + '/>' +
      '<circle cx="30" cy="45" r="2.5" fill="#e63946"/><circle cx="40" cy="45" r="2.5" fill="#e63946"/><rect x="24" y="56" width="52" height="24" rx="3" fill="#e7ecf5"' + S + '/><rect x="40" y="58" width="20" height="3" rx="1.5" fill="#9aa3b5"/>' +
      '<path d="M30 40 V30 H54 V40" fill="#9aa3b5"' + S + '/><rect x="26" y="26" width="32" height="5" rx="2" fill="#9aa3b5"' + S + '/>' + line('M36 20 q-3 -4 0 -8 M46 20 q-3 -4 0 -8', '#c5ccd8', 2.4) + line('M58 33 H70', INK, 3), '#fff8e7'),
    garden: svg('<rect y="70" width="100" height="30" fill="#6cc070"/>' + line('M8 50 V86 M28 50 V86 M48 50 V86 M68 50 V86 M88 50 V86 M4 58 H96 M4 74 H96', '#c98a4b', 4) +
      ['#ef476f', '#ffd166', '#9b7ede', '#ff8fc7'].map(function (c, i) { var x = 18 + i * 21; return line('M' + x + ' 90 V70', '#2bb673', 3) + '<circle cx="' + x + '" cy="66" r="7" fill="' + c + '"' + S + '/><circle cx="' + x + '" cy="66" r="2.5" fill="#fff6c4"/>'; }).join('') +
      '<circle cx="80" cy="20" r="9" fill="#ffd166"/>', '#cdeafe'),
    sofa: svg('<rect x="18" y="30" width="64" height="30" rx="8" fill="#ef476f"' + S + '/><rect x="8" y="46" width="18" height="34" rx="7" fill="#e03158"' + S + '/><rect x="74" y="46" width="18" height="34" rx="7" fill="#e03158"' + S + '/>' +
      '<rect x="24" y="56" width="52" height="20" rx="5" fill="#ff6b8b"' + S + '/>' + line('M50 56 V76', INK, 1.5) + line('M16 80 V88 M84 80 V88', INK, 3.5), '#fff0f3'),
    tea: svg('<path d="M24 46 Q24 82 50 82 Q76 82 76 46 Z" fill="#fff"' + S + '/><path d="M24 46 H76" stroke="' + INK + '" stroke-width="2"/><path d="M76 52 Q88 46 92 34" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M24 56 Q10 58 14 70 Q18 76 26 70" fill="none" stroke="' + INK + '" stroke-width="4"/><ellipse cx="50" cy="44" rx="10" ry="4" fill="#fff"' + S + '/><circle cx="50" cy="38" r="3" fill="#2bb673"' + S + '/>' +
      '<path d="M36 62 q14 -8 28 0" fill="none" stroke="#2bb673" stroke-width="3"/>' + line('M86 26 q-3 -5 0 -9', '#9aa3b5', 2), '#eafaf1'),
    cake: svg('<path d="M14 72 L50 34 L86 72 Z" fill="#ffe8b3"' + S + ' stroke-linejoin="round"/><path d="M14 72 H86 V86 H14 Z" fill="#f3c97a"' + S + '/><path d="M18 64 Q50 60 82 64" stroke="#ff8fc7" stroke-width="5" fill="none"/>' +
      '<circle cx="50" cy="32" r="6" fill="#e63946"' + S + '/>' + line('M50 26 Q54 18 60 16', '#2bb673', 2), '#fff8e7'),
    photo: svg('<rect x="14" y="18" width="72" height="62" rx="4" fill="#c98a4b"' + S + '/><rect x="22" y="26" width="56" height="46" fill="#cdeafe"/><path d="M22 72 L40 48 L52 62 L62 52 L78 72 Z" fill="#6cc070"/>' +
      '<circle cx="66" cy="38" r="6" fill="#ffd166"/>' + line('M40 18 L50 8 L60 18', INK, 2), '#fdf0e6'),
    flower: svg(line('M50 92 V48', '#2bb673', 5) + '<path d="M50 74 Q30 70 26 56 Q42 56 50 70 Z" fill="#2bb673"/>' +
      [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="50" cy="22" rx="11" ry="15" fill="#ff8fc7"' + S + ' transform="rotate(' + a + ' 50 38)"/>'; }).join('') + '<circle cx="50" cy="38" r="9" fill="#ffd166"' + S + '/>', '#fff0f3'),
    lamp: svg('<path d="M30 46 L40 14 H60 L70 46 Z" fill="#ffd166"' + S + ' stroke-linejoin="round"/>' + line('M50 46 V80', INK, 4) + '<rect x="32" y="80" width="36" height="8" rx="3" fill="' + INK + '"/>' +
      line('M22 58 l-6 4 M78 58 l6 4 M50 54 v0', '#f4a259', 3) + '<path d="M30 46 Q50 54 70 46" fill="#fff4c4" opacity="0.9"/>', '#fffbe6'),

    newyear: svg('<rect x="22" y="22" width="56" height="56" rx="4" fill="#e63946"' + S + ' transform="rotate(45 50 50)"/>' + text(50, 62, '福', 34, '#ffd166', 700) +
      '<path d="M50 4 V14" stroke="#ffd166" stroke-width="3"/>', '#fdecee'),
    lantern: svg(line('M50 6 V18', INK, 2.5) + '<rect x="40" y="16" width="20" height="6" rx="2" fill="#ffd166"' + S + '/><ellipse cx="50" cy="50" rx="30" ry="28" fill="#e63946"' + S + '/>' +
      '<path d="M50 22 Q34 50 50 78 M50 22 Q66 50 50 78 M50 22 V78" fill="none" stroke="#b8302a" stroke-width="2"/><rect x="40" y="76" width="20" height="6" rx="2" fill="#ffd166"' + S + '/>' + line('M44 82 V94 M50 82 V96 M56 82 V94', '#ffd166', 2.5), '#fff8e7'),
    redenvelope: svg('<rect x="26" y="12" width="48" height="76" rx="5" fill="#e63946"' + S + '/><path d="M26 18 Q50 36 74 18" fill="#c92a37"' + S + '/>' +
      '<circle cx="50" cy="56" r="13" fill="#ffd166" stroke="#d9a10f" stroke-width="2"/>' + text(50, 62, '福', 16, '#e63946', 700), '#fdecee'),
    fireworks: svg('<rect width="100" height="100" rx="18" fill="#22305e"/>' +
      [[32, 36, '#ff8fc7'], [70, 30, '#ffd166'], [56, 70, '#7fd1d9']].map(function (f) {
        var g = ''; for (var i = 0; i < 10; i++) { var a = i * Math.PI / 5; g += line('M' + (f[0] + 5 * Math.cos(a)).toFixed(1) + ' ' + (f[1] + 5 * Math.sin(a)).toFixed(1) + ' L' + (f[0] + 16 * Math.cos(a)).toFixed(1) + ' ' + (f[1] + 16 * Math.sin(a)).toFixed(1), f[2], 2.6); }
        return g + '<circle cx="' + f[0] + '" cy="' + f[1] + '" r="3" fill="' + f[2] + '"/>'; }).join('')),
    dragon: svg('<path d="M18 62 Q14 34 40 26 Q58 20 74 30 L88 26 L82 40 Q90 52 80 64 Q70 76 50 76 Q30 76 18 62 Z" fill="#2bb673"' + S + ' stroke-linejoin="round"/>' +
      '<path d="M40 26 L44 12 L50 24 L56 10 L60 24 L66 14 L68 28" fill="#e63946"' + S + ' stroke-linejoin="round"/><ellipse cx="66" cy="66" rx="16" ry="8" fill="#9de2a8"' + S + '/>' +
      '<circle cx="62" cy="42" r="7" fill="#fff"' + S + '/><circle cx="64" cy="42" r="3" fill="' + INK + '"/><circle cx="76" cy="64" r="2" fill="' + INK + '"/>' +
      line('M82 70 Q92 78 96 70 M80 74 Q86 86 94 84', '#ffd166', 2.5), '#eafaf1'),
    mooncake: svg('<circle cx="50" cy="52" r="34" fill="#c98a4b"' + S + '/><circle cx="50" cy="52" r="26" fill="#e2a35f" stroke="#a8692c" stroke-width="2"/>' +
      [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<circle cx="50" cy="20" r="5" fill="#c98a4b"' + S + ' transform="rotate(' + a + ' 50 52)"/>'; }).join('') +
      '<path d="M40 44 Q50 34 60 44 Q50 54 40 44 Z M40 60 Q50 50 60 60 Q50 70 40 60 Z" fill="none" stroke="#a8692c" stroke-width="2"/>', '#fdf0e6'),
    birthday: svg('<rect x="18" y="52" width="64" height="34" rx="6" fill="#ff8fc7"' + S + '/><path d="M18 62 Q26 70 34 62 Q42 70 50 62 Q58 70 66 62 Q74 70 82 62" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
      [32, 50, 68].map(function (x, i) { return '<rect x="' + (x - 3) + '" y="32" width="6" height="20" rx="2" fill="' + ['#4ea8de', '#ffd166', '#2bb673'][i] + '"' + S + '/><path d="M' + x + ' 20 Q' + (x + 6) + ' 27 ' + x + ' 31 Q' + (x - 6) + ' 27 ' + x + ' 20 Z" fill="#ff8c1a"/>'; }).join(''), '#fff0f3'),
    christmas: svg('<path d="M50 12 L74 44 H62 L82 70 H18 L38 44 H26 Z" fill="#2bb673"' + S + ' stroke-linejoin="round"/><rect x="44" y="70" width="12" height="16" fill="#8d5a3b"' + S + '/>' +
      star(50, 12, 8) + '<circle cx="42" cy="38" r="3.5" fill="#e63946"/><circle cx="58" cy="54" r="3.5" fill="#4ea8de"/><circle cx="36" cy="62" r="3.5" fill="#ffd166"/><circle cx="66" cy="64" r="3.5" fill="#e63946"/>', '#eafaf1'),

    name: svg('<rect x="10" y="26" width="80" height="52" rx="8" fill="#e63946"' + S + '/><rect x="16" y="44" width="68" height="28" rx="4" fill="#fff"/>' + text(50, 40, 'HELLO', 11, '#fff') +
      line('M24 60 Q32 52 38 60 T52 60 T66 58 T78 60', '#4ea8de', 3), '#fdecee'),
    age: svg('<rect x="58" y="10" width="20" height="80" rx="3" fill="#ffd166"' + S + '/>' + line('M58 20 H66 M58 30 H70 M58 40 H66 M58 50 H70 M58 60 H66 M58 70 H70 M58 80 H66', INK, 2) +
      person({ style: 'short', hair: '#3b2a20', shirt: '#4ea8de', s: 0.7, x: 34, y: 96 }) + line('M48 36 H58', '#ef476f', 2.5), '#e8f4ff'),
    live: svg('<path d="M14 54 L44 30 L74 54 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><rect x="20" y="52" width="48" height="36" fill="#ffd166"' + S + '/><rect x="38" y="66" width="12" height="22" fill="#8d5a3b"' + S + '/>' +
      '<path d="M76 12 Q64 12 64 24 Q64 34 76 46 Q88 34 88 24 Q88 12 76 12 Z" fill="#e63946"' + S + '/><circle cx="76" cy="24" r="5" fill="#fff"/>', '#e8f4ff'),
    like: svg('<path d="M30 46 H44 L52 18 Q60 18 60 28 V40 H78 Q86 40 84 48 L78 76 Q76 82 70 82 H44 Q38 82 36 78 V46 Z" fill="' + SKIN + '"' + SK + ' stroke-linejoin="round"/>' +
      '<rect x="14" y="44" width="18" height="40" rx="3" fill="#4ea8de"' + S + '/>' + line('M60 52 H80 M60 62 H78 M60 72 H74', '#c9946b', 2), '#e8f4ff'),
    country: svg('<circle cx="50" cy="50" r="34" fill="#4ea8de"' + S + '/><path d="M28 30 Q38 24 46 32 Q44 44 34 46 Q26 42 28 30 Z M56 40 Q70 36 76 48 Q74 64 62 70 Q54 62 58 52 Z M30 62 Q40 60 42 70 Q36 78 30 72 Z" fill="#6cc070"' + S + '/>' +
      '<ellipse cx="50" cy="50" rx="34" ry="12" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.6"/>', '#e8f4ff'),
    language: svg('<path d="M10 20 H54 Q60 20 60 26 V48 Q60 54 54 54 H28 L18 64 V54 H16 Q10 54 10 48 V26 Q10 20 16 20 Z" fill="#4ea8de"' + S + '/>' + text(35, 44, 'Aa', 18, '#fff') +
      '<path d="M90 42 H50 Q44 42 44 48 V70 Q44 76 50 76 H72 L82 86 V76 H84 Q90 76 90 70 V48 Q90 42 84 42 Z" fill="#ef476f"' + S + '/>' + text(67, 66, '文', 18, '#fff', 700), '#f4f6fb'),
    speak: svg(face(36, 60, 26) + eyes(36, 54, 8, 2.6) + '<ellipse cx="40" cy="70" rx="6" ry="5" fill="#7a3b3b"' + S + '/>' +
      '<path d="M58 14 H90 Q94 14 94 18 V38 Q94 42 90 42 H72 L62 50 L64 42 H58 Q54 42 54 38 V18 Q54 14 58 14 Z" fill="#fff"' + S + '/>' +
      '<circle cx="64" cy="28" r="3" fill="' + INK + '"/><circle cx="74" cy="28" r="3" fill="' + INK + '"/><circle cx="84" cy="28" r="3" fill="' + INK + '"/>', '#fffbe6'),
    australia: svg('<path d="M30 88 Q24 70 34 56 Q30 46 36 38 Q30 30 38 24 L40 12 L46 22 Q56 22 58 32 Q66 34 64 44 Q74 52 72 66 Q86 74 94 88 Q80 80 70 80 L62 88 Z" fill="#c98a4b"' + S + ' stroke-linejoin="round"/>' +
      '<circle cx="50" cy="30" r="2.5" fill="' + INK + '"/><path d="M60 38 l3 2" stroke="' + INK + '" stroke-width="2"/><path d="M48 62 Q56 58 60 66 Q54 72 48 68 Z" fill="#e2b48a"/>' +
      '<circle cx="16" cy="18" r="7" fill="#ffd166"/>', '#fff4e6'),

    seeyou: svg(person({ style: 'short', hair: '#2f2a28', shirt: '#4ea8de', s: 0.62, x: 26, y: 96 }) + person({ style: 'long', hair: '#5a3b2a', shirt: '#ef476f', s: 0.62, x: 74, y: 96 }) +
      D.hand(14, 46, -20) .replace('translate(14 46)', 'translate(12 50) scale(0.6)') + D.hand(86, 46, 20).replace('translate(86 46)', 'translate(88 50) scale(0.6)') +
      line('M40 30 Q50 22 60 30', '#9aa3b5', 2.4) + '<path d="M58 26 L61 31 L55 31 Z" fill="#9aa3b5"/>', '#e8f4ff'),
    welcome: svg(face(50, 50, 28) + line('M38 46 q4 -5 8 0 M54 46 q4 -5 8 0', INK, 2.6) + smile(50, 58, 9) +
      '<circle cx="34" cy="58" r="3.5" fill="#f29c9c"/><circle cx="66" cy="58" r="3.5" fill="#f29c9c"/>' +
      '<g fill="' + SKIN + '"' + SK + '><ellipse cx="22" cy="84" rx="14" ry="7"/><ellipse cx="78" cy="84" rx="14" ry="7"/></g>' +
      '<path d="M50 14 C46 10 40 14 44 19 L50 25 L56 19 C60 14 54 10 50 14 Z" fill="#ef476f"/>', '#fffbe6'),
    hug: svg('<path d="M14 96 Q14 60 36 60 Q52 60 56 74" fill="#4ea8de"' + S + '/><path d="M86 96 Q86 60 64 60 Q48 60 44 74" fill="#ef476f"' + S + '/>' +
      '<circle cx="38" cy="40" r="15" fill="' + SKIN + '"' + SK + '/><circle cx="62" cy="40" r="15" fill="' + SKIN + '"' + SK + '/>' +
      '<path d="M24 36 Q26 22 40 24 Q48 26 50 34 Q40 28 24 36 Z" fill="#2f2a28"/><path d="M76 38 Q76 22 62 24 Q52 26 52 36 L50 56 Q50 30 76 38 Z" fill="#5a3b2a"/>' +
      line('M33 42 q3 3 6 0 M61 42 q3 3 6 0', INK, 2) + line('M30 74 Q50 88 70 74', SKIN, 8) + '<path d="M50 10 C47 7 43 10 46 13 L50 17 L54 13 C57 10 53 7 50 10 Z" fill="#ef476f"/>', '#fff8e7'),
    phone: svg('<rect x="30" y="10" width="40" height="80" rx="8" fill="' + INK + '"/><rect x="34" y="18" width="32" height="60" rx="3" fill="#4ea8de"/><circle cx="50" cy="84" r="3" fill="#9aa3b5"/>' +
      '<path d="M40 50 Q40 40 46 38 L49 44 L46 46 Q46 52 52 56 L54 53 L60 56 Q58 62 50 62 Q40 60 40 50 Z" fill="#fff"/>' + line('M76 30 q6 6 0 12 M82 26 q10 10 0 20', '#ef476f', 2.4), '#eef6ff'),
    missyou: svg(face(38, 62, 24) + eyes(38, 58, 8, 2.6) + frown(38, 70, 6) + '<circle cx="66" cy="34" r="3" fill="#fff"' + S + '/><circle cx="72" cy="26" r="4" fill="#fff"' + S + '/>' +
      '<ellipse cx="78" cy="14" rx="16" ry="11" fill="#fff"' + S + '/><path d="M78 10 C75 6 70 10 73 14 L78 19 L83 14 C86 10 81 6 78 10 Z" fill="#ef476f"/>', '#eef2fb'),
    comeback: svg('<path d="M48 54 L72 34 L96 54 Z" fill="#ef476f"' + S + ' stroke-linejoin="round"/><rect x="54" y="52" width="36" height="30" fill="#ffd166"' + S + '/><rect x="66" y="64" width="10" height="18" fill="#8d5a3b"/>' +
      '<path d="M12 78 Q10 30 50 22" fill="none" stroke="#2bb673" stroke-width="5" stroke-linecap="round"/><path d="M46 14 L58 22 L46 30 Z" fill="#2bb673"/>', '#eafaf1'),
    goodluck: svg(line('M50 56 Q56 76 50 92', '#1f8a56', 4) +
      [[50, 36], [30, 54], [70, 54], [50, 70]].map(function (c, i) { var a = [0, -90, 90, 180][i]; return '<path d="M50 52 C34 44 34 24 46 26 C48 22 52 22 54 26 C66 24 66 44 50 52 Z" fill="#2bb673"' + S + ' transform="rotate(' + a + ' 50 52)"/>'; }).join('') +
      '<circle cx="50" cy="52" r="4" fill="#1f8a56"/>', '#eafaf1'),
    havefun: svg('<path d="M14 88 L30 44 L58 72 Z" fill="#9b7ede"' + S + ' stroke-linejoin="round"/>' + line('M22 66 L44 80 M26 56 L50 74', '#ffd166', 2.5) +
      '<rect x="52" y="20" width="8" height="5" rx="1" fill="#ef476f" transform="rotate(30 56 22)"/><rect x="70" y="36" width="8" height="5" rx="1" fill="#4ea8de" transform="rotate(-20 74 38)"/>' +
      '<rect x="40" y="14" width="7" height="4" rx="1" fill="#2bb673"/><circle cx="76" cy="18" r="3.5" fill="#ffd166"/><circle cx="64" cy="48" r="3" fill="#ff8fc7"/><circle cx="84" cy="54" r="3.5" fill="#2bb673"/>' +
      line('M60 34 Q68 28 66 20 M74 60 Q82 58 86 66', '#ef476f', 2.2), '#f3efff')
  };

  Object.assign(LQ.PICTURES, P);
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
