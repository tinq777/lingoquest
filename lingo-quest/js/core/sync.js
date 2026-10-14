/* Lingo Quest — family sync through the site's own /api/sync endpoint
   (a Cloudflare Pages Function with a KV store). A family code is the only key:
   no accounts. Each device pulls the family copy, merges it with its own
   (best progress wins, deletions stick), and pushes the result back. */
(function (LQ) {
  'use strict';

  var ENDPOINT = 'api/sync';
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I, easy to read out

  function newCode() {
    var bytes = new Uint8Array(12), out = '';
    (window.crypto || globalThis.crypto).getRandomValues(bytes);
    for (var i = 0; i < 12; i++) out += ALPHABET[bytes[i] % 32];
    return format(out);
  }
  /* Accepts any spacing, dashes or case. Returns "ABCD-EFGH-JKLM" or null. */
  function cleanCode(text) {
    var raw = String(text || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length !== 12) return null;
    for (var i = 0; i < 12; i++) if (ALPHABET.indexOf(raw[i]) < 0) return null;
    return format(raw);
  }
  function format(raw) { return raw.slice(0, 4) + '-' + raw.slice(4, 8) + '-' + raw.slice(8, 12); }

  function SyncError(kind, message) { var e = new Error(message); e.kind = kind; return e; }

  var MESSAGES = {
    offline: 'No internet right now. Progress will sync when you are back online.',
    setup: 'Sync is not set up on the website yet. Add the KV store in Cloudflare (see the README), then try again.',
    notfound: 'No family found with that code. Check it and try again.',
    server: 'The sync service had a problem. Try again in a minute.'
  };

  function request(method, code, body) {
    var opts = { method: method, headers: { 'x-lq-key': code.replace(/-/g, '') }, cache: 'no-store' };
    if (body) { opts.headers['content-type'] = 'application/json'; opts.body = JSON.stringify(body); }
    return Promise.resolve().then(function () { return fetch(ENDPOINT, opts); }).catch(function () { throw SyncError('offline', MESSAGES.offline); }).then(function (res) {
      var ct = res.headers.get('content-type') || '';
      // Without the function deployed, Pages serves the app page (HTML) or a 404/405.
      if (ct.indexOf('application/json') < 0) throw SyncError('setup', MESSAGES.setup);
      return res.json().then(function (j) {
        if (res.status === 503 && j.error === 'not-configured') throw SyncError('setup', MESSAGES.setup);
        if (res.ok || res.status === 409) return { status: res.status, body: j };
        throw SyncError('server', MESSAGES.server);
      });
    });
  }

  function pull(code) {
    return request('GET', code).then(function (r) { return r.body; }); // { data, rev }
  }

  /* One full round: pull, merge into `state`, push if the family copy is behind.
     Resolves { state, rev, skipped, pushed }. `state` is never modified. */
  function syncOnce(state, code, opts) {
    var tries = 0;
    function round() {
      tries++;
      return pull(code).then(function (remote) {
        if (opts && opts.mustExist && !remote.data) throw SyncError('notfound', MESSAGES.notfound);
        var merged = remote.data ? LQ.store.syncMerge(state, remote.data, opts) : { state: state, skipped: [] };
        var payload = LQ.store.syncPayload(merged.state);
        var same = remote.data && JSON.stringify(LQ.store.syncPayload(LQ.store.migrate(remote.data))) === JSON.stringify(payload);
        if (same) return { state: merged.state, rev: remote.rev, skipped: merged.skipped, pushed: false };
        return request('PUT', code, { base: remote.rev || 0, data: payload }).then(function (r) {
          if (r.status === 409) {
            if (tries >= 3) throw SyncError('server', MESSAGES.server);
            state = merged.state;
            return round(); // another device saved first: merge again
          }
          return { state: merged.state, rev: r.body.rev, skipped: merged.skipped, pushed: true };
        });
      });
    }
    return round();
  }

  LQ.sync = { newCode: newCode, cleanCode: cleanCode, pull: pull, syncOnce: syncOnce, MESSAGES: MESSAGES, ENDPOINT: ENDPOINT };
})(typeof window !== 'undefined' ? (window.LQ = window.LQ || {}) : (globalThis.LQ = globalThis.LQ || {}));
