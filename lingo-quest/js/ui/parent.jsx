/* Lingo Quest — parent area: learners, this week, custom words, sound, sync, backups. */
(function (LQ) {
  'use strict';
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  var ui = LQ.ui, Icon = ui.Icon, Pic = ui.Pic, Avatar = ui.Avatar, WordText = ui.WordText;

  /* Save a backup file: the phone's share sheet when it can take files, otherwise a download. */
  function saveBackup(state, profile) {
    var data = LQ.store.exportData(state, profile ? profile.id : null);
    var name = LQ.store.backupFileName(profile ? profile.name : null);
    var text = JSON.stringify(data, null, 2);
    var file = null;
    try { file = new File([text], name, { type: 'application/json' }); } catch (e) { file = null; }
    if (file && navigator.canShare && navigator.share) {
      try {
        if (navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: 'Lingo Quest backup' }).then(function () { return 'shared'; }, function (err) {
            if (err && err.name === 'AbortError') return 'cancelled';
            return download(text, name);
          });
        }
      } catch (e) { /* fall through to download */ }
    }
    return Promise.resolve(download(text, name));
  }
  function download(text, name) {
    var url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    var a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
    return 'downloaded';
  }

  function fmtDate(ts) {
    if (!ts) return 'never';
    try { return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return String(ts); }
  }

  function LearnersTab(props) {
    var s = props.state;
    var delS = useState(null), del = delS[0], setDel = delS[1];
    return <div className="screen">
      <h2>Learners</h2>
      <div className="list">{s.profiles.map(function (p) {
        return <div key={p.id} className="item">
          <Avatar profile={p} size={44} />
          <div className="grow"><b>{p.name}</b><br /><span className="small muted">{LQ.BANDS[p.band].label} · {p.langs.map(function (l) { return LQ.LANGUAGES[l].name; }).join(', ')}</span></div>
          <button className="icon-btn" aria-label={'Edit ' + p.name} onClick={function () { props.onEdit(p.id); }}><Icon name="edit" /></button>
          <button className="icon-btn" aria-label={'Delete ' + p.name} onClick={function () { setDel(p); }}><Icon name="trash" /></button>
        </div>;
      })}</div>
      <p className="small muted">{s.profiles.length} of {LQ.store.MAX_PROFILES} learners.</p>
      <div className="grow" />
      {s.profiles.length < LQ.store.MAX_PROFILES ? <button className="btn jade block" onClick={props.onAdd}><Icon name="plus" />Add learner</button> : null}
      {del ? <ui.Confirm title={'Delete ' + del.name + '?'} body={'Their stars, stickers and progress will be removed from ' + (s.settings.sync && s.settings.sync.code ? 'every synced device' : 'this device') + '. Export a backup first if you might want them back.'}
        ok="Delete" danger onCancel={function () { setDel(null); }} onOk={function () { props.onDelete(del.id); setDel(null); }} /> : null}
    </div>;
  }

  function weekKeys(today) {
    var p = today.split('-').map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    var monday = (d.getDay() + 6) % 7;
    var out = [];
    for (var i = 0; i < 7; i++) out.push(LQ.store.addDays(today, i - monday));
    return out;
  }

  function WeekTab(props) {
    var s = props.state, today = LQ.store.dayKey(), keys = weekKeys(today);
    return <div className="screen">
      <h2>This week</h2>
      <div className="card week">
        <span />{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(function (d, i) { return <span key={i} style={keys[i] === today ? { color: 'var(--plum)' } : null}>{d}</span>; })}
        {s.profiles.map(function (p) {
          return <React.Fragment key={p.id}>
            <span className="nm">{p.name}</span>
            {keys.map(function (k) { var on = p.days.indexOf(k) >= 0; return <i key={k} className={on ? 'on' : ''} aria-label={p.name + (on ? ' practised ' : ' did not practise ') + k} />; })}
          </React.Fragment>;
        })}
      </div>
      <div className="list grow" style={{ overflow: 'hidden' }}>{s.profiles.map(function (p) {
        var weak = [];
        p.langs.forEach(function (l) { LQ.srs.weakest(p.srs[l] || {}, 2).forEach(function (x) { var w = LQ.content.wordByKey(l + ':' + x.id, s.custom); if (w) weak.push(w); }); });
        return <div key={p.id} className="item">
          <Avatar profile={p} size={36} />
          <div className="grow">
            <div className="row" style={{ gap: 10 }}><b>{p.name}</b><span className="small muted">{LQ.store.totalStars(p)} stars · {LQ.store.streak(p, today)}-day streak</span></div>
            <div className="small muted">{weak.length ? 'Tricky: ' + weak.slice(0, 3).map(function (w) { return w.t + ' (' + w.en + ')'; }).join(', ') : 'No tricky words yet'}</div>
          </div>
        </div>;
      })}</div>
    </div>;
  }

  function WordsTab(props) {
    var s = props.state;
    var langS = useState(LQ.defaultLang()), lang = langS[0], setLang = langS[1];
    var unitS = useState(LQ.UNITS[0].id), unit = unitS[0], setUnit = unitS[1];
    var enS = useState(''), en = enS[0], setEn = enS[1];
    var tS = useState(''), t = tS[0], setT = tS[1];
    var rS = useState(''), r = rS[0], setR = rS[1];
    var pageS = useState(0), page = pageS[0], setPage = pageS[1];
    var PER = 3;
    var list = s.custom.slice().reverse();
    var pages = Math.max(1, Math.ceil(list.length / PER));
    var shown = list.slice(page * PER, page * PER + PER);
    var ok = en.trim() && t.trim() && (lang !== 'zh' || r.trim());
    function add(e) {
      e.preventDefault();
      if (!ok) return;
      props.onAdd({ lang: lang, unit: unit, en: en.trim(), t: t.trim(), r: (lang === 'zh' || lang === 'ar') ? r.trim() || null : null });
      setEn(''); setT(''); setR(''); setPage(0);
    }
    return <div className="screen">
      <h2>Your own words</h2>
      <form className="list" onSubmit={add}>
        <div className={'seg' + (LQ.langList().length > 3 ? ' seg-4' : '')}>{LQ.langList().map(function (L) {
          return <button type="button" key={L.id} className={L.id === lang ? 'on' : ''} onClick={function () { setLang(L.id); }}>{L.name}</button>;
        })}</div>
        <div className="row">
          <select className="input" aria-label="Unit" value={unit} onChange={function (e) { setUnit(e.target.value); }}>
            {LQ.UNITS.map(function (u) { return <option key={u.id} value={u.id}>{u.title}</option>; })}
          </select>
          <input className="input" aria-label="English" placeholder="English" value={en} maxLength={30} onChange={function (e) { setEn(e.target.value); }} />
        </div>
        <div className="row">
          <input className="input" aria-label={LQ.LANGUAGES[lang].name + ' word'} placeholder={LQ.LANGUAGES[lang].name + ' word'} value={t} maxLength={40} onChange={function (e) { setT(e.target.value); }} />
          {lang === 'zh' ? <input className="input" aria-label="Pinyin" placeholder="Pinyin, e.g. lǎo shī" value={r} maxLength={60} onChange={function (e) { setR(e.target.value); }} /> : null}
          {lang === 'ar' ? <input className="input" aria-label="English-letter spelling" placeholder="Spelling, e.g. mudarris" value={r} maxLength={60} onChange={function (e) { setR(e.target.value); }} /> : null}
        </div>
        <button className="btn jade block" disabled={!ok}><Icon name="plus" />Add word</button>
      </form>
      <div className="list grow" style={{ overflow: 'hidden' }}>
        {shown.length ? shown.map(function (c) {
          return <div key={c.id} className="item">
            <div className="grow"><b className={c.lang === 'zh' ? 'zh' : ''}>{c.t}</b>{c.r ? <span className="small muted"> {c.r}</span> : null}<br />
              <span className="small muted">{c.en} · {LQ.LANGUAGES[c.lang].name} · {LQ.unitById(c.unit).title}</span></div>
            <button className="icon-btn" aria-label={'Delete ' + c.en} onClick={function () { props.onDelete(c.id); }}><Icon name="trash" /></button>
          </div>;
        }) : <p className="muted">Add words your family uses, like your street, school or team. They join that unit's lessons for readers and adults.</p>}
      </div>
      {pages > 1 ? <div className="row between">
        <button className="btn sm" disabled={page === 0} onClick={function () { setPage(page - 1); }}>Previous</button>
        <span className="small muted">{page + 1} / {pages}</span>
        <button className="btn sm" disabled={page >= pages - 1} onClick={function () { setPage(page + 1); }}>Next</button>
      </div> : null}
    </div>;
  }

  function BackupTab(props) {
    var s = props.state;
    var whoS = useState(''), who = whoS[0], setWho = whoS[1];
    var msgS = useState(null), msg = msgS[0], setMsg = msgS[1];
    var prevS = useState(null), preview = prevS[0], setPreview = prevS[1];
    var confS = useState(false), confirmReplace = confS[0], setConfirmReplace = confS[1];
    var fileRef = useRef(null);
    var overdue = LQ.store.backupOverdue(s);

    function doExport() {
      var p = who ? s.profiles.filter(function (x) { return x.id === who; })[0] : null;
      saveBackup(s, p).then(function (how) {
        if (how === 'cancelled') return;
        if (!p) props.onBackedUp();
        setMsg({ kind: 'good', text: (p ? p.name + "'s" : 'Full') + ' backup ' + (how === 'shared' ? 'shared.' : 'saved to your downloads.') });
      });
    }
    function onFile(e) {
      var f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        var res = LQ.store.parseBackup(String(reader.result));
        if (!res.ok) setMsg({ kind: 'bad', text: res.error });
        else setPreview(res);
      };
      reader.readAsText(f);
    }
    function apply(mode) {
      var out = props.onRestore(preview.data, mode);
      setPreview(null); setConfirmReplace(false);
      var parts = [];
      if (out.added.length) parts.push('Added ' + out.added.join(', ') + '.');
      if (out.updated.length) parts.push('Updated ' + out.updated.join(', ') + '.');
      if (out.skipped.length) parts.push('Skipped ' + out.skipped.join(', ') + ': the app holds 4 learners.');
      setMsg({ kind: out.skipped.length ? 'bad' : 'good', text: parts.join(' ') || 'Nothing to change.' });
    }

    return <div className="screen">
      <h2>Backup</h2>
      <div className={'notice' + (overdue ? ' bad' : '')}>Last full backup: {fmtDate(s.settings.lastBackup)}.{overdue ? ' Time for a new one.' : ''}</div>
      <div className="row">
        <select className="input" aria-label="What to back up" value={who} onChange={function (e) { setWho(e.target.value); }}>
          <option value="">Everyone</option>
          {s.profiles.map(function (p) { return <option key={p.id} value={p.id}>{p.name} only</option>; })}
        </select>
        <button className="btn jade" onClick={doExport} disabled={!s.profiles.length}>Export</button>
      </div>
      <button className="btn block" onClick={function () { fileRef.current.click(); }}>Restore from a file</button>
      <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={onFile} aria-label="Backup file" />
      {msg ? <div className={'notice ' + msg.kind} role="status">{msg.text}</div> : null}
      <div className="field"><span>Backup reminder</span>
        <div className="seg">
          <button className={!s.settings.backupReminder ? 'on' : ''} onClick={function () { props.onSettings({ backupReminder: false }); }}>Off</button>
          {[14, 30, 60].map(function (d) {
            var on = s.settings.backupReminder && s.settings.reminderDays === d;
            return <button key={d} className={on ? 'on' : ''} onClick={function () { props.onSettings({ backupReminder: true, reminderDays: d }); }}>{d} days</button>;
          })}
        </div></div>


      {preview ? <ui.Sheet title="Restore this backup?" onClose={function () { setPreview(null); setConfirmReplace(false); }}>
        <div className="card list small">
          <div><b>Learners:</b> {preview.summary.profiles.join(', ') || 'none'}</div>
          <div><b>Own words:</b> {preview.summary.customWords}</div>
          <div><b>Saved:</b> {fmtDate(preview.summary.exportedAt)}</div>
        </div>
        {confirmReplace ? <React.Fragment>
          <div className="notice bad">Replace wipes everyone on this device and restores the backup instead.</div>
          <div className="row"><button className="btn grow" onClick={function () { setConfirmReplace(false); }}>Back</button>
            <button className="btn primary grow" onClick={function () { apply('replace'); }}>Replace everything</button></div>
        </React.Fragment> : <React.Fragment>
          <p className="small muted">Merge adds missing learners and keeps the best progress for learners already here.</p>
          <div className="row"><button className="btn grow" onClick={function () { setConfirmReplace(true); }}>Replace</button>
            <button className="btn plum grow" onClick={function () { apply('merge'); }}>Merge</button></div>
        </React.Fragment>}
      </ui.Sheet> : null}
    </div>;
  }

  function fmtWhen(ts) {
    if (!ts) return 'not yet';
    var mins = Math.round((Date.now() - ts) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    try { return new Date(ts).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return String(ts); }
  }

  function copyText(text) {
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return false; }); } catch (e) { /* fall through */ }
    return Promise.resolve(false);
  }

  /* Type a family code to link this device. Used from the parent area and the welcome screen. */
  function JoinSheet(props) {
    var codeS = useState(''), code = codeS[0], setCode = codeS[1];
    var modeS = useState('combine'), mode = modeS[0], setMode = modeS[1];
    var errS = useState(null), err = errS[0], setErr = errS[1];
    var busyS = useState(false), busy = busyS[0], setBusy = busyS[1];
    var here = props.state.profiles;
    var clean = LQ.sync.cleanCode(code);
    function go() {
      if (!clean) { setErr('A family code has 12 letters and numbers, like ABCD-EFGH-JK23.'); return; }
      setBusy(true); setErr(null);
      props.sync.join(clean, mode).then(function () { setBusy(false); props.onJoined(); }, function (e) { setBusy(false); setErr(e.message); });
    }
    return <ui.Sheet title="Join your family" onClose={props.onClose}>
      <p className="small muted" style={{ textAlign: 'center' }}>Find the code on the first device in Parent area › Sync.</p>
      <input className="input code-input" aria-label="Family code" placeholder="ABCD-EFGH-JK23" autoCapitalize="characters" autoCorrect="off" spellCheck={false}
        value={code} maxLength={16} onChange={function (e) { setCode(e.target.value); setErr(null); }} />
      {here.length ? <div className="field"><span>Learners on this device</span>
        <div className="seg">
          <button className={mode === 'combine' ? 'on' : ''} aria-pressed={mode === 'combine'} onClick={function () { setMode('combine'); }}>Combine</button>
          <button className={mode === 'replace' ? 'on' : ''} aria-pressed={mode === 'replace'} onClick={function () { setMode('replace'); }}>Use family's only</button>
        </div>
        <span className="small muted">{mode === 'combine' ? 'Keeps ' + here.map(function (p) { return p.name; }).join(', ') + '. A learner with the same name on both devices becomes one, with the best progress.' : 'Removes the learners on this device and uses the family\'s instead.'}</span>
      </div> : null}
      {err ? <div className="notice bad small" role="status">{err}</div> : null}
      <button className="btn primary block" disabled={busy || !code} onClick={go}>{busy ? 'Joining…' : 'Join'}</button>
    </ui.Sheet>;
  }

  function SyncTab(props) {
    var s = props.state, sync = props.sync, conf = s.settings.sync;
    var joinS = useState(false), joining = joinS[0], setJoining = joinS[1];
    var leaveS = useState(false), leaving = leaveS[0], setLeaving = leaveS[1];
    var copiedS = useState(false), copied = copiedS[0], setCopied = copiedS[1];
    var msgS = useState(null), msg = msgS[0], setMsg = msgS[1];
    var info = sync.info;
    function quiet(p) { p.then(function () { setMsg(null); }, function () {}); }

    if (!conf || !conf.code) return <div className="screen">
      <h2>Sync</h2>
      <div className="notice">Keep everyone's stars and progress the same on every phone and tablet. No accounts: devices share a family code.</div>
      <ol className="small list sync-steps">
        <li>On the device with your learners, tap <b>Start family sync</b>.</li>
        <li>On each other device, tap <b>Join with a code</b> and type the code.</li>
      </ol>
      {info.error ? <div className="notice bad small" role="status">{info.error}</div> : null}
      <button className="btn primary block" disabled={info.busy || !s.profiles.length} onClick={function () { quiet(sync.start()); }}>{info.busy ? 'Starting…' : 'Start family sync'}</button>
      <button className="btn block" onClick={function () { setJoining(true); }}>Join with a code</button>
      {joining ? <JoinSheet state={s} sync={sync} onClose={function () { setJoining(false); }} onJoined={function () { setJoining(false); setMsg('Joined. Everyone is up to date.'); }} /> : null}
    </div>;

    return <div className="screen">
      <h2>Sync</h2>
      <div className="field"><span>Family code</span>
        <div className="row code-row">
          <div className="sync-code" aria-label="Family code">{conf.code}</div>
          <button className="btn" onClick={function () { copyText(conf.code).then(function (ok) { setCopied(ok ? 'Copied' : 'Copy it by hand'); setTimeout(function () { setCopied(false); }, 2000); }); }}>{copied || 'Copy'}</button>
        </div>
        <span className="small muted">Type this on each device: Parent area › Sync › Join. Keep it in the family, like a Wi-Fi password.</span></div>
      <div className={'notice' + (info.error ? ' bad' : ' good')} role="status">
        {info.busy ? 'Syncing…' : info.error ? info.error : 'Synced ' + fmtWhen(conf.lastSync) + '. Progress syncs by itself when the app opens and after playing.'}
      </div>
      {msg ? <div className="notice good small">{msg}</div> : null}
      <button className="btn jade block" disabled={info.busy} onClick={function () { quiet(sync.now()); }}><Icon name="cloud" /> Sync now</button>
      <button className="btn ghost block" onClick={function () { setLeaving(true); }}>Stop syncing on this device</button>
      {leaving ? <ui.Confirm title="Stop syncing here?" body="Learners stay on this device but stop updating from the family. You can join again later with the same code."
        ok="Stop syncing" danger onCancel={function () { setLeaving(false); }} onOk={function () { sync.leave(); setLeaving(false); }} /> : null}
    </div>;
  }

  function SoundTab(props) {
    var s = props.state;
    var voiceS = useState(LQ.speech.report()), voices = voiceS[0], setVoices = voiceS[1];
    useEffect(function () { return LQ.speech.onVoices(function () { setVoices(LQ.speech.report()); }); }, []);
    return <div className="screen">
      <h2>Sound</h2>
      <div className="field"><span>Sound effects</span>
        <div className="seg">
          <button className={s.settings.sfx !== false ? 'on' : ''} aria-pressed={s.settings.sfx !== false} onClick={function () { props.onSettings({ sfx: true }); LQ.sfx.setEnabled(true); LQ.sfx.play('correct'); }}>On</button>
          <button className={s.settings.sfx === false ? 'on' : ''} aria-pressed={s.settings.sfx === false} onClick={function () { props.onSettings({ sfx: false }); }}>Off</button>
        </div></div>
      <div className="field"><span>Voices</span>
        <div className="list small voices">{voices.map(function (v) {
          if (!v.ok) return <div key={v.lang} className="row between"><b>{v.name}</b><span style={{ color: 'var(--red-d)', fontWeight: 800 }}>Missing: add one in your device settings</span></div>;
          return <div key={v.lang} className="voice-row">
            <b>{v.name}</b>
            <select className="input" aria-label={v.name + ' voice'} value={v.chosen}
              onChange={function (e) {
                var next = Object.assign({}, s.settings.voices || {}); if (e.target.value) next[v.lang] = e.target.value; else delete next[v.lang];
                LQ.speech.setPreferred(next); props.onSettings({ voices: next }); setVoices(LQ.speech.report()); LQ.speech.sample(v.lang);
              }}>
              <option value="">Automatic: {v.chosen ? 'best voice' : v.voice}</option>
              {v.options.map(function (o) { return <option key={o.id} value={o.id}>{o.name}{o.quality ? ' · ' + o.quality : ''}{o.robotic ? ' · novelty' : ''}</option>; })}
            </select>
            <button className="speak" aria-label={'Test ' + v.name + ' voice'} onClick={function () { LQ.speech.sample(v.lang); }}><Icon name="speaker" /></button>
          </div>;
        })}</div>
        <span className="small muted">Voices marked Premium or Enhanced sound the most natural. On iPhone you can download them free in Settings › Accessibility › Spoken Content › Voices.</span></div>
    </div>;
  }

  function ParentArea(props) {
    var tabS = useState('learners'), tab = tabS[0], setTab = tabS[1];
    var s = props.state;
    var TABS = [['learners', 'Learners', 'family'], ['week', 'Week', 'review'], ['words', 'Words', 'edit'], ['sound', 'Sound', 'speaker'], ['sync', 'Sync', 'cloud'], ['backup', 'Backup', 'parent']];
    var body = null;
    if (tab === 'learners') body = <LearnersTab state={s} onEdit={props.onEdit} onAdd={props.onAdd} onDelete={props.onDelete} />;
    if (tab === 'week') body = <WeekTab state={s} />;
    if (tab === 'words') body = <WordsTab state={s} onAdd={props.onAddWord} onDelete={props.onDeleteWord} />;
    if (tab === 'sound') body = <SoundTab state={s} onSettings={props.onSettings} />;
    if (tab === 'sync') body = <SyncTab state={s} sync={props.sync} />;
    if (tab === 'backup') body = <BackupTab state={s} onBackedUp={props.onBackedUp} onRestore={props.onRestore} onSettings={props.onSettings} />;
    return <div className="parent grow" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="topbar"><button className="icon-btn" aria-label="Close parent area" onClick={props.onClose}><Icon name="close" /></button><h3>Parent area</h3></div>
      {body}
      <nav className="tabs">{TABS.map(function (t) {
        return <button key={t[0]} className={'tab' + (tab === t[0] ? ' on' : '')} aria-current={tab === t[0] ? 'page' : null} onClick={function () { setTab(t[0]); }}>
          <Icon name={t[2]} />{t[1]}{t[0] === 'backup' && LQ.store.backupOverdue(s) ? <span className="dot" /> : null}</button>;
      })}</nav>
    </div>;
  }

  LQ.parent = { ParentArea: ParentArea, JoinSheet: JoinSheet, saveBackup: saveBackup };
})(window.LQ = window.LQ || {});
