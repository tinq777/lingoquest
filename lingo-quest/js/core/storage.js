/* Lingo Quest — state, profiles, streaks and backups.
   localStorage is the only persistence. Every read and write is guarded, and
   the app keeps working in memory if storage is blocked. */
(function (LQ) {
  'use strict';

  var KEY = 'lingoQuest';
  var SCHEMA = 1;
  var MAX_PROFILES = 4;
  var COLOURS = ['#ef476f', '#f4a259', '#2bb673', '#1d6fd1', '#8a6fd1', '#14b8a6'];
  var memory = null;

  function uid(prefix) { return (prefix || 'p') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function defaultState() {
    return { schema: SCHEMA, profiles: [], custom: [], removed: { p: {}, c: {} }, settings: { backupReminder: true, reminderDays: 30, lastBackup: null, sfx: true } };
  }

  function normalizeProfile(p) {
    var langs = (Array.isArray(p.langs) ? p.langs : []).filter(function (l) { return LQ.LANGUAGES[l]; });
    if (!langs.length) langs = [LQ.defaultLang()];
    var band = LQ.BANDS[p.band] ? p.band : 'adult';
    return {
      id: String(p.id || uid('p')), name: String(p.name || 'Learner').slice(0, 16),
      avatar: LQ.AVATARS[p.avatar] ? p.avatar : 'panda', colour: COLOURS.indexOf(p.colour) >= 0 ? p.colour : COLOURS[0],
      band: band, langs: langs, lang: langs.indexOf(p.lang) >= 0 ? p.lang : langs[0],
      coins: Math.max(0, Number(p.coins) || 0), stars: Object.assign({}, p.stars || {}),
      stickers: Array.isArray(p.stickers) ? p.stickers.slice() : [], srs: Object.assign({}, p.srs || {}),
      days: Array.isArray(p.days) ? p.days.filter(function (d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }).sort().slice(-90) : [],
      createdAt: Number(p.createdAt) || Date.now(), editedAt: Number(p.editedAt) || Number(p.createdAt) || 0
    };
  }

  function normalizeCustom(c) {
    if (!c || !LQ.LANGUAGES[c.lang] || !LQ.unitById(c.unit) || !c.t || !c.en) return null;
    return { id: String(c.id || uid('c')), lang: c.lang, unit: c.unit, en: String(c.en).slice(0, 30), t: String(c.t).slice(0, 40), r: c.r ? String(c.r).slice(0, 60) : null };
  }

  /* Deleted learners and words, kept so sync does not bring them back. */
  function normalizeRemoved(r) {
    var out = { p: {}, c: {} };
    ['p', 'c'].forEach(function (k) {
      var src = r && r[k] && typeof r[k] === 'object' ? r[k] : {};
      Object.keys(src).slice(0, 500).forEach(function (id) { var t = Number(src[id]); if (t > 0) out[k][id] = t; });
    });
    return out;
  }

  /* Bring any saved or imported data up to the current schema. */
  function migrate(data) {
    if (!data || typeof data !== 'object') throw new Error('Not a Lingo Quest file');
    var schema = Number(data.schema) || 0;
    if (schema > SCHEMA) throw new Error('This backup is from a newer version of Lingo Quest');
    var base = defaultState();
    var out = {
      schema: SCHEMA,
      profiles: (Array.isArray(data.profiles) ? data.profiles : []).slice(0, 12).map(normalizeProfile),
      custom: (Array.isArray(data.custom) ? data.custom : []).map(normalizeCustom).filter(Boolean),
      removed: normalizeRemoved(data.removed),
      settings: Object.assign({}, base.settings, data.settings || {})
    };
    return out;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return memory || defaultState();
      var s = migrate(JSON.parse(raw));
      s.profiles = s.profiles.slice(0, MAX_PROFILES);
      remember(s);
      return s;
    } catch (e) { return memory || defaultState(); }
  }

  /* Name, picture, colour, style and languages are "settings" of a learner.
     When they change, editedAt moves on so sync knows which version is newer. */
  var sigs = {};
  function sigOf(p) { return JSON.stringify([p.name, p.avatar, p.colour, p.band, p.langs]); }
  function remember(state) { sigs = {}; (state.profiles || []).forEach(function (p) { sigs[p.id] = sigOf(p); }); }

  function save(state, opts) {
    if (!(opts && opts.fromSync)) {
      var now = Date.now();
      (state.profiles || []).forEach(function (p) { if (sigs[p.id] && sigs[p.id] !== sigOf(p)) p.editedAt = now; });
    }
    remember(state);
    memory = state;
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
  }

  function newProfile(o) {
    return normalizeProfile({ id: uid('p'), name: o.name, avatar: o.avatar, colour: o.colour, band: o.band, langs: o.langs || [LQ.defaultLang()], createdAt: Date.now() });
  }

  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addDays(key, n) {
    var p = key.split('-').map(Number);
    return dayKey(new Date(p[0], p[1] - 1, p[2] + n));
  }

  /* Consecutive days ending today (or yesterday, so a streak is not lost before today's practice). */
  function streakFrom(hasDay, today) {
    var d = hasDay(today) ? today : addDays(today, -1);
    var n = 0;
    while (hasDay(d) && n < 3650) { n++; d = addDays(d, -1); }
    return n;
  }
  function streak(profile, today) {
    var set = {}; profile.days.forEach(function (d) { set[d] = true; });
    return streakFrom(function (d) { return !!set[d]; }, today || dayKey());
  }
  function familyStreak(profiles, today) {
    if (!profiles.length) return 0;
    var sets = profiles.map(function (p) { var s = {}; p.days.forEach(function (d) { s[d] = true; }); return s; });
    return streakFrom(function (d) { return sets.every(function (s) { return s[d]; }); }, today || dayKey());
  }

  function markPracticed(profile, today) {
    var d = today || dayKey();
    if (profile.days.indexOf(d) < 0) profile.days = profile.days.concat([d]).sort().slice(-90);
    return profile;
  }

  function unitUnlocked(profile, lang, index) {
    if (index === 0) return true;
    var prev = LQ.UNITS[index - 1];
    return !!(prev && profile.stars[lang + ':' + prev.id] > 0);
  }

  function totalStars(profile) {
    return Object.keys(profile.stars).reduce(function (a, k) { return a + (profile.stars[k] || 0); }, 0);
  }

  /* ---------- Backups ---------- */

  function exportData(state, profileId) {
    var profiles = profileId ? state.profiles.filter(function (p) { return p.id === profileId; }) : state.profiles;
    return {
      app: 'lingo-quest', schema: SCHEMA, exportedAt: new Date().toISOString(), scope: profileId ? 'profile' : 'all',
      profiles: profiles, custom: state.custom,
      settings: profileId ? undefined : { backupReminder: state.settings.backupReminder, reminderDays: state.settings.reminderDays }
    };
  }

  function backupFileName(profileName) {
    var base = 'lingo-quest-backup-' + dayKey();
    return (profileName ? base + '-' + String(profileName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : base) + '.json';
  }

  function parseBackup(text) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return { ok: false, error: 'That file is not a Lingo Quest backup.' }; }
    if (!data || data.app !== 'lingo-quest') return { ok: false, error: 'That file is not a Lingo Quest backup.' };
    try {
      var clean = migrate(data);
      return {
        ok: true, data: clean,
        summary: {
          profiles: clean.profiles.map(function (p) { return p.name; }),
          customWords: clean.custom.length, exportedAt: data.exportedAt || null, scope: data.scope || 'all'
        }
      };
    } catch (e) { return { ok: false, error: e.message }; }
  }

  function mergeProfile(a, b) {
    var stars = Object.assign({}, a.stars);
    Object.keys(b.stars).forEach(function (k) { stars[k] = Math.max(stars[k] || 0, b.stars[k] || 0); });
    var srs = {};
    var langs = {};
    Object.keys(a.srs).concat(Object.keys(b.srs)).forEach(function (l) { langs[l] = true; });
    Object.keys(langs).forEach(function (l) {
      var x = a.srs[l] || {}, y = b.srs[l] || {}, out = {};
      Object.keys(x).concat(Object.keys(y)).forEach(function (id) { out[id] = LQ.srs.mergeEntry(x[id], y[id]); });
      srs[l] = out;
    });
    var union = function (p, q) { var s = {}; p.concat(q).forEach(function (v) { s[v] = true; }); return Object.keys(s).sort(); };
    return normalizeProfile(Object.assign({}, a, {
      coins: Math.max(a.coins, b.coins), stars: stars, srs: srs,
      stickers: union(a.stickers, b.stickers), days: union(a.days, b.days),
      langs: union(a.langs, b.langs)
    }));
  }

  function unremove(removed, profiles, custom) {
    var r = normalizeRemoved(removed);
    profiles.forEach(function (p) { delete r.p[p.id]; });
    custom.forEach(function (c) { delete r.c[c.id]; });
    return r;
  }

  /* Returns { state, added, updated, skipped } without touching the input. */
  function mergeBackup(state, data) {
    var profiles = state.profiles.map(function (p) { return normalizeProfile(p); });
    var added = [], updated = [], skipped = [];
    data.profiles.forEach(function (bp) {
      var i = profiles.findIndex(function (p) { return p.id === bp.id; });
      if (i >= 0) { profiles[i] = mergeProfile(profiles[i], bp); updated.push(bp.name); }
      else if (profiles.length < MAX_PROFILES) { profiles.push(normalizeProfile(bp)); added.push(bp.name); }
      else skipped.push(bp.name);
    });
    var custom = state.custom.slice();
    data.custom.forEach(function (c) { if (!custom.some(function (x) { return x.id === c.id; })) custom.push(c); });
    return { state: Object.assign({}, state, { profiles: profiles, custom: custom, removed: unremove(state.removed, profiles, custom) }), added: added, updated: updated, skipped: skipped };
  }

  function replaceBackup(state, data) {
    var profiles = data.profiles.slice(0, MAX_PROFILES);
    var skipped = data.profiles.slice(MAX_PROFILES).map(function (p) { return p.name; });
    return {
      state: Object.assign({}, state, { profiles: profiles, custom: data.custom.slice(), removed: unremove(state.removed, profiles, data.custom), settings: Object.assign({}, state.settings, data.settings || {}) }),
      added: profiles.map(function (p) { return p.name; }), updated: [], skipped: skipped
    };
  }

  /* ---------- Family sync ---------- */

  /* What goes to the cloud: learners, own words and deletions. Device settings
     (voices, sounds, reminders, the sync code) stay on each device. */
  function syncPayload(state) {
    return { app: 'lingo-quest', schema: SCHEMA, profiles: state.profiles, custom: state.custom, removed: normalizeRemoved(state.removed) };
  }

  function markRemoved(state, kind, id, now) {
    state.removed = normalizeRemoved(state.removed);
    state.removed[kind][id] = now || Date.now();
    return state;
  }

  /* Combine this device with the family copy. Progress keeps the best of both;
     a learner's name, picture and languages come from whichever was edited last;
     anything deleted on any device stays deleted. Pure: returns a new state. */
  function syncMerge(state, remote, opts) {
    var r = migrate(remote || {});
    var removed = normalizeRemoved(state.removed);
    ['p', 'c'].forEach(function (k) { Object.keys(r.removed[k]).forEach(function (id) { removed[k][id] = Math.max(removed[k][id] || 0, r.removed[k][id]); }); });
    var local = state.profiles.map(normalizeProfile);
    // When joining, a learner set up separately on both devices with the same name becomes one learner.
    if (opts && opts.matchNames) {
      local = local.map(function (p) {
        if (r.profiles.some(function (q) { return q.id === p.id; })) return p;
        var twin = r.profiles.filter(function (q) { return q.name.trim().toLowerCase() === p.name.trim().toLowerCase(); })[0];
        return twin ? Object.assign({}, p, { id: twin.id, createdAt: twin.createdAt }) : p;
      });
    }
    var byId = {}, order = [];
    function put(p, fromRemote) {
      if (removed.p[p.id]) return;
      var have = byId[p.id];
      if (!have) { byId[p.id] = p; order.push(p.id); return; }
      var merged = mergeProfile(have, p);
      var meta = (p.editedAt || 0) > (have.editedAt || 0) ? p : have;
      merged.name = meta.name; merged.avatar = meta.avatar; merged.colour = meta.colour; merged.band = meta.band;
      merged.langs = meta.langs.slice(); merged.editedAt = Math.max(have.editedAt || 0, p.editedAt || 0);
      var here = fromRemote ? have : p; // the language each device is showing stays its own
      merged.lang = merged.langs.indexOf(here.lang) >= 0 ? here.lang : merged.langs[0];
      byId[p.id] = normalizeProfile(merged);
    }
    r.profiles.forEach(function (p) { put(p, true); });
    local.forEach(function (p) { put(p, false); });
    var profiles = order.map(function (id) { return byId[id]; }).sort(function (a, b) { return a.createdAt - b.createdAt; });
    var skipped = profiles.slice(MAX_PROFILES).map(function (p) { return p.name; });
    profiles = profiles.slice(0, MAX_PROFILES);
    var custom = [], seen = {};
    r.custom.concat(state.custom).forEach(function (c) { if (!removed.c[c.id] && !seen[c.id]) { seen[c.id] = true; custom.push(c); } });
    return { state: Object.assign({}, state, { profiles: profiles, custom: custom, removed: removed }), skipped: skipped };
  }

  function backupOverdue(state, now) {
    if (!state.settings.backupReminder || !state.profiles.length) return false;
    var last = state.settings.lastBackup;
    var start = last || Math.min.apply(null, state.profiles.map(function (p) { return p.createdAt; }));
    return (now || Date.now()) - start > state.settings.reminderDays * LQ.srs.DAY;
  }

  LQ.store = {
    KEY: KEY, SCHEMA: SCHEMA, MAX_PROFILES: MAX_PROFILES, COLOURS: COLOURS,
    defaultState: defaultState, load: load, save: save, migrate: migrate, newProfile: newProfile,
    normalizeProfile: normalizeProfile, normalizeCustom: normalizeCustom, uid: uid,
    dayKey: dayKey, addDays: addDays, streak: streak, familyStreak: familyStreak, markPracticed: markPracticed,
    unitUnlocked: unitUnlocked, totalStars: totalStars,
    exportData: exportData, backupFileName: backupFileName, parseBackup: parseBackup,
    mergeBackup: mergeBackup, replaceBackup: replaceBackup, backupOverdue: backupOverdue,
    syncPayload: syncPayload, syncMerge: syncMerge, markRemoved: markRemoved, normalizeRemoved: normalizeRemoved
  };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
