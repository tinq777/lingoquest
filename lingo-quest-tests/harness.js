/* Tiny test harness: test(name, fn) with async support and a summary. */
const results = [];
const queue = [];
function test(name, fn) { queue.push({ name, fn }); }
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }
function eq(a, b, msg) { if (a !== b) throw new Error((msg ? msg + ': ' : '') + 'expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a)); }
async function run(title) {
  for (const t of queue) {
    try { await t.fn(); results.push([true, t.name]); }
    catch (e) { results.push([false, t.name, e]); }
  }
  const fails = results.filter(r => !r[0]);
  for (const f of fails) console.log('FAIL', f[1], '\n   ', f[2] && (f[2].stack || f[2]).toString().split('\n').slice(0, 4).join('\n    '));
  console.log(`${title}: ${results.length - fails.length}/${results.length} passed`);
  return fails.length;
}
module.exports = { test, assert, eq, run };
