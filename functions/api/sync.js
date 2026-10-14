/* Lingo Quest family sync — Cloudflare Pages Function at /api/sync.
   Needs a KV namespace bound to this Pages project as LQ_SYNC.
   The family code arrives in the x-lq-key header and is only ever stored hashed. */

const ALPHABET = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{12}$/;
const MAX_BYTES = 400 * 1024;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

async function storageKey(code) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lingo-quest:' + code));
  return 'family:' + [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function looksValid(data) {
  return data && typeof data === 'object' && data.app === 'lingo-quest' &&
    Array.isArray(data.profiles) && data.profiles.length <= 12 && Array.isArray(data.custom);
}

export async function onRequest({ request, env }) {
  const kv = env.LQ_SYNC;
  if (!kv) return json({ error: 'not-configured' }, 503);

  const code = (request.headers.get('x-lq-key') || '').toUpperCase();
  if (!ALPHABET.test(code)) return json({ error: 'bad-code' }, 400);
  const key = await storageKey(code);

  if (request.method === 'GET') {
    const saved = await kv.get(key, 'json');
    return json(saved ? { data: saved.data, rev: saved.rev, at: saved.at } : { data: null, rev: 0 });
  }

  if (request.method === 'PUT') {
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ error: 'too-big' }, 413);
    let body;
    try { body = JSON.parse(text); } catch (e) { return json({ error: 'bad-json' }, 400); }
    if (!body || !looksValid(body.data)) return json({ error: 'bad-data' }, 400);
    const saved = await kv.get(key, 'json');
    const rev = saved ? saved.rev : 0;
    // Another device saved since this one last looked: send it the newer copy to merge.
    if (Number(body.base) !== rev) return json({ error: 'conflict', data: saved && saved.data, rev }, 409);
    const next = { data: body.data, rev: rev + 1, at: Date.now() };
    await kv.put(key, JSON.stringify(next));
    return json({ ok: true, rev: next.rev, at: next.at });
  }

  return json({ error: 'method' }, 405);
}
