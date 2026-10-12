/* Lingo Quest — app shell: state, navigation, review and co-op sessions. */
(function (LQ) {
  'use strict';
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef, useMemo = React.useMemo;
  var ui = LQ.ui, Icon = ui.Icon, Avatar = ui.Avatar, Pic = ui.Pic;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* Review: due words first, then tricky ones, leaning 70/30 towards Chinese when several languages are on. */
  function buildReview(p, custom, rng) {
    rng = rng || Math.random;
    var B = LQ.BANDS[p.band], now = Date.now();
    var langs = p.langs.filter(function (l) { return Object.keys(p.srs[l] || {}).length; });
    if (!langs.length) return [];
    var weights = langs.map(function (l) {
      if (langs.length === 1) return 1;
      if (langs.indexOf('zh') >= 0) return l === 'zh' ? 0.7 : 0.3 / (langs.length - 1);
      return 1 / langs.length;
    });
    var order = [];
    for (var i = 0; i < B.review; i++) {
      var x = rng(), acc = 0, pickL = langs[langs.length - 1];
      for (var k = 0; k < langs.length; k++) { acc += weights[k]; if (x < acc) { pickL = langs[k]; break; } }
      order.push(pickL);
    }
    var sets = {};
    langs.forEach(function (l) {
      var n = order.filter(function (o) { return o === l; }).length;
      if (!n) return;
      var srsL = p.srs[l] || {};
      var ids = LQ.srs.dueIds(srsL, now);
      LQ.srs.weakest(srsL, 20).forEach(function (w) { if (ids.indexOf(w.id) < 0) ids.push(w.id); });
      Object.keys(srsL).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
      var words = ids.slice(0, Math.max(n, 4)).map(function (id) { return LQ.content.wordByKey(l + ':' + id, custom); }).filter(Boolean);
      sets[l] = LQ.questions.buildSet(words.slice(0, Math.max(n, 1)), LQ.content.langWords(l, custom), n, p.band, rng, srsL);
    });
    var idx = {};
    return order.map(function (l) { idx[l] = (idx[l] || 0); return (sets[l] || [])[idx[l]++]; }).filter(Boolean);
  }

  function SessionDone(props) {
    return <div className="screen center">
      <h1>{props.title}</h1>
      {props.children}
      <button className="btn primary block" onClick={props.onExit}>Done</button>
    </div>;
  }

  function Review(props) {
    var p = props.profile;
    var qs = useMemo(function () { return buildReview(p, props.custom); }, []);
    var subS = useState(0), sub = subS[0], setSub = subS[1];
    var doneS = useState(null), done = doneS[0], setDone = doneS[1];
    var right = useRef(0);
    useEffect(function () { if (!qs.length) props.onExit(); }, []);
    if (done) return <SessionDone title="Review done!" onExit={props.onExit}>
      <p className="muted">{right.current} of {qs.length} right first time.</p>
      <span className="pill"><Icon name="coin" />+{right.current}</span>
    </SessionDone>;
    return <div className="grow" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <LQ.lesson.LessonTop pct={sub / Math.max(1, qs.length)} label="Review" onExit={props.onExit} />
      <LQ.lesson.Questions questions={qs} band={p.band}
        isMastered={function (w) { return LQ.srs.isMastered((p.srs[w.lang] || {})[w.id]); }}
        banner={function (i) { var l = qs[i].lang; return p.langs.length > 1 ? <div className="row" style={{ justifyContent: 'center' }}><span className="chip on">{LQ.LANGUAGES[l].name}</span></div> : null; }}
        onProgress={setSub}
        onAnswer={function (q, first) { if (first) right.current++; props.onAnswer(q.word, first); }}
        onDone={function () { props.onFinish(); setDone(true); }} />
    </div>;
  }

  function CoopSetup(props) {
    var s = props.state;
    var selS = useState(s.profiles.map(function (p) { return p.id; })), sel = selS[0], setSel = selS[1];
    var langs = LQ.langList().filter(function (L) { return s.profiles.some(function (p) { return sel.indexOf(p.id) >= 0 && p.langs.indexOf(L.id) >= 0; }); });
    var langS = useState(LQ.defaultLang()), lang = langS[0], setLang = langS[1];
    var useLang = langs.some(function (L) { return L.id === lang; }) ? lang : (langs[0] ? langs[0].id : LQ.defaultLang());
    return <ui.Sheet title="Play together" onClose={props.onClose}>
      <p className="small muted" style={{ textAlign: 'center' }}>Take turns on this phone. Everyone answers at their own level.</p>
      <div className="row wrap" style={{ justifyContent: 'center' }}>{s.profiles.map(function (p) {
        var on = sel.indexOf(p.id) >= 0;
        return <button key={p.id} className={'choice' + (on ? ' on' : '')} aria-pressed={on} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 800 }}
          onClick={function () { setSel(on ? sel.filter(function (x) { return x !== p.id; }) : sel.concat([p.id])); }}>
          <Avatar profile={p} size={54} />{p.name}</button>;
      })}</div>
      <div className="seg">{langs.map(function (L) {
        return <button key={L.id} className={L.id === useLang ? 'on' : ''} onClick={function () { setLang(L.id); }}>{L.name}</button>;
      })}</div>
      <button className="btn sun block" disabled={sel.length < 2} onClick={function () {
        props.onStart(s.profiles.filter(function (p) { return sel.indexOf(p.id) >= 0; }).map(function (p) { return p.id; }), useLang);
      }}>{sel.length < 2 ? 'Pick at least 2 players' : 'Start'}</button>
    </ui.Sheet>;
  }

  function Coop(props) {
    var players = props.players, lang = props.lang;
    var ROUNDS = 3;
    var qs = useMemo(function () {
      var pool = LQ.content.langWords(lang, props.custom);
      var out = [];
      for (var r = 0; r < ROUNDS; r++) {
        players.forEach(function (p) {
          var units = LQ.UNITS.filter(function (u, i) { return LQ.store.unitUnlocked(p, lang, i); });
          var words = [];
          units.forEach(function (u) { words = words.concat(LQ.content.unitWords(lang, u.id, props.custom)); });
          var q = LQ.questions.buildSet(words, pool, 1, p.band)[0];
          if (q) { q.player = p.id; out.push(q); }
        });
      }
      return out;
    }, []);
    var subS = useState(0), sub = subS[0], setSub = subS[1];
    var scoreS = useState({}), score = scoreS[0], setScore = scoreS[1];
    var doneS = useState(false), done = doneS[0], setDone = doneS[1];
    var byId = {}; players.forEach(function (p) { byId[p.id] = p; });
    if (done) {
      var ranked = players.slice().sort(function (a, b) { return (score[b.id] || 0) - (score[a.id] || 0); });
      return <SessionDone title="Great teamwork!" onExit={props.onExit}>
        <div className="list" style={{ width: '100%' }}>{ranked.map(function (p) {
          return <div key={p.id} className="item"><Avatar profile={p} size={40} /><b className="grow">{p.name}</b><span className="pill"><Icon name="star" color="#ffc93c" />{score[p.id] || 0}</span></div>;
        })}</div>
      </SessionDone>;
    }
    return <div className="grow" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <LQ.lesson.LessonTop pct={sub / Math.max(1, qs.length)} label="Together" onExit={props.onExit} />
      <LQ.lesson.Questions questions={qs}
        bandFor={function (i) { return byId[qs[i].player].band; }}
        isMastered={function (w) { return false; }}
        banner={function (i) { var p = byId[qs[i].player]; return <div className="row" style={{ justifyContent: 'center' }}><Avatar profile={p} size={36} /><b style={{ color: p.colour }}>{p.name}'s turn</b></div>; }}
        onProgress={setSub}
        onAnswer={function (q, first) {
          if (first) setScore(function (s0) { var n = Object.assign({}, s0); n[q.player] = (n[q.player] || 0) + 1; return n; });
          props.onAnswer(q.player, q.word, first);
        }}
        onDone={function () { props.onFinish(players.map(function (p) { return p.id; })); setDone(true); }} />
    </div>;
  }

  function VoiceWarning(props) {
    return <ui.Sheet title="A voice is missing" onClose={props.onClose}>
      <p style={{ textAlign: 'center' }}>This device has no {props.names.join(' or ')} voice, so words in {props.names.length > 1 ? 'those languages' : 'that language'} will be silent.</p>
      <p className="small muted" style={{ textAlign: 'center' }}>Add one in your device's language or speech settings, then reopen Lingo Quest. Parent area › Backup shows which voices are found.</p>
      <button className="btn primary block" onClick={props.onClose}>OK</button>
    </ui.Sheet>;
  }

  function App() {
    var st = useState(function () { return LQ.store.load(); }), state = st[0], setState = st[1];
    var stateRef = useRef(state); stateRef.current = state;
    var first = state.profiles.length === 0 ? { name: 'welcome' } : state.profiles.length === 1 ? { name: 'home', id: state.profiles[0].id } : { name: 'picker' };
    var scS = useState(first), screen = scS[0], setScreen = scS[1];
    var gateS = useState(null), gate = gateS[0], setGate = gateS[1];
    var coopS = useState(false), coopSetup = coopS[0], setCoopSetup = coopS[1];
    var voiceS = useState(null), voiceWarn = voiceS[0], setVoiceWarn = voiceS[1];
    var restoreRef = useRef(null);
    var reS = useState(null), restoreError = reS[0], setRestoreError = reS[1];
    var warned = useRef({});

    function update(fn) {
      var next = clone(stateRef.current);
      fn(next);
      stateRef.current = next;
      LQ.store.save(next);
      setState(next);
      return next;
    }
    function findP(s, id) { return s.profiles.filter(function (p) { return p.id === id; })[0]; }
    var profile = screen.id ? findP(state, screen.id) : null;

    // Warn once per language when the device has no voice for it.
    useEffect(function () {
      if (!profile || screen.name !== 'home') return;
      var check = function () {
        var missing = LQ.speech.report().filter(function (v) { return !v.ok && profile.langs.indexOf(v.lang) >= 0 && !warned.current[v.lang]; });
        if (LQ.speech.report().every(function (v) { return !v.ok; })) return; // voices not loaded yet, or no speech at all
        if (missing.length) { missing.forEach(function (v) { warned.current[v.lang] = true; }); setVoiceWarn(missing.map(function (v) { return v.name; })); }
      };
      var t = setTimeout(check, 1500);
      var off = LQ.speech.onVoices(check);
      return function () { clearTimeout(t); off(); };
    }, [screen.name, screen.id, profile ? profile.langs.join() : '']);

    function recordAnswer(pid, word, firstTry) {
      update(function (s) {
        var p = findP(s, pid); if (!p) return;
        p.srs[word.lang] = p.srs[word.lang] || {};
        p.srs[word.lang][word.id] = LQ.srs.record(p.srs[word.lang][word.id], firstTry, Date.now());
        if (firstTry) p.coins += 1;
      });
    }
    function practised(ids) {
      update(function (s) { ids.forEach(function (id) { var p = findP(s, id); if (p) LQ.store.markPracticed(p); }); });
    }

    function profileSaved(data) {
      if (screen.mode === 'edit') {
        update(function (s) { var p = findP(s, screen.id); Object.assign(p, data); s.profiles = s.profiles.map(LQ.store.normalizeProfile); });
        setScreen(screen.back || { name: 'parent' });
      } else {
        var np = LQ.store.newProfile(data);
        update(function (s) { if (s.profiles.length < LQ.store.MAX_PROFILES) s.profiles.push(np); });
        setScreen(screen.back && screen.back.name === 'parent' ? screen.back : { name: 'home', id: np.id });
      }
    }

    function openRestore() { if (restoreRef.current) restoreRef.current.click(); }
    function onRestoreFile(e) {
      var f = e.target.files && e.target.files[0]; e.target.value = '';
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var res = LQ.store.parseBackup(String(r.result));
        if (!res.ok) { setRestoreError(res.error); return; }
        setRestoreError(null);
        var out = LQ.store.replaceBackup(stateRef.current, res.data);
        update(function (s) { Object.assign(s, clone(out.state)); });
        setScreen(out.state.profiles.length ? { name: 'picker' } : { name: 'welcome' });
      };
      r.readAsText(f);
    }

    var view = null;
    if (screen.name === 'welcome') {
      view = <LQ.home.Welcome error={restoreError} onStart={function () { setScreen({ name: 'form', mode: 'add', back: { name: 'welcome' } }); }} onImport={openRestore} />;
    } else if (screen.name === 'picker') {
      view = <LQ.home.Picker state={state} onPick={function (id) { setScreen({ name: 'home', id: id }); }}
        onAdd={function () { setGate({ what: 'adding a learner', next: { name: 'form', mode: 'add', back: { name: 'picker' } } }); }} />;
    } else if (screen.name === 'form') {
      var editing = screen.mode === 'edit' ? findP(state, screen.id) : null;
      view = <LQ.home.ProfileForm profile={editing} index={state.profiles.length} onSave={profileSaved}
        onCancel={function () { setScreen(screen.back || { name: 'picker' }); }} />;
    } else if (screen.name === 'home' && profile) {
      view = <LQ.home.Home key={profile.id} profile={profile} state={state} tab={screen.tab}
        onTab={function (t) { screen.tab = t; }}
        onSwitchProfile={function () { setScreen({ name: 'picker' }); }}
        onSwitchLang={function (l) { update(function (s) { findP(s, profile.id).lang = l; }); }}
        onAddLang={function (l) { update(function (s) { var p = findP(s, profile.id); if (p.langs.indexOf(l) < 0) p.langs.push(l); p.langs = LQ.langList().map(function (x) { return x.id; }).filter(function (x) { return p.langs.indexOf(x) >= 0; }); p.lang = l; }); }}
        onStartUnit={function (u) { setScreen({ name: 'lesson', id: profile.id, unit: u, lang: profile.lang, run: Date.now() }); }}
        onReview={function () { setScreen({ name: 'review', id: profile.id }); }}
        onCoop={function () { setCoopSetup(true); }}
        onParent={function () { setGate({ what: 'the parent area', next: { name: 'parent', back: { name: 'home', id: profile.id, tab: 'family' } } }); }} />;
    } else if (screen.name === 'lesson' && profile) {
      var back = { name: 'home', id: profile.id, tab: 'map' };
      view = <LQ.lesson.Lesson key={screen.run} profile={profile} lang={screen.lang} unitId={screen.unit} custom={state.custom}
        onExit={function () { LQ.speech.stop(); setScreen(back); }}
        onRetry={function () { setScreen(Object.assign({}, screen, { run: Date.now() })); }}
        onAnswer={function (w, firstTry) { recordAnswer(profile.id, w, firstTry); }}
        onComplete={function (stars) {
          var key = screen.lang + ':' + screen.unit, result = { stars: stars, coins: stars * 5, sticker: false };
          update(function (s) {
            var p = findP(s, profile.id);
            p.stars[key] = Math.max(p.stars[key] || 0, stars);
            p.coins += result.coins;
            if (p.stickers.indexOf(key) < 0) { p.stickers.push(key); result.sticker = true; }
            LQ.store.markPracticed(p);
          });
          return result;
        }} />;
    } else if (screen.name === 'review' && profile) {
      view = <Review profile={profile} custom={state.custom}
        onExit={function () { LQ.speech.stop(); setScreen({ name: 'home', id: profile.id, tab: 'review' }); }}
        onAnswer={function (w, f) { recordAnswer(profile.id, w, f); }}
        onFinish={function () { practised([profile.id]); }} />;
    } else if (screen.name === 'coop') {
      var players = screen.players.map(function (id) { return findP(state, id); }).filter(Boolean);
      view = <Coop players={players} lang={screen.lang} custom={state.custom}
        onExit={function () { LQ.speech.stop(); setScreen(screen.back); }}
        onAnswer={recordAnswer} onFinish={practised} />;
    } else if (screen.name === 'parent') {
      view = <LQ.parent.ParentArea state={state}
        onClose={function () { setScreen(screen.back && findP(state, screen.back.id) ? screen.back : (state.profiles.length ? { name: 'picker' } : { name: 'welcome' })); }}
        onEdit={function (id) { setScreen({ name: 'form', mode: 'edit', id: id, back: screen }); }}
        onAdd={function () { setScreen({ name: 'form', mode: 'add', back: screen }); }}
        onDelete={function (id) { update(function (s) { s.profiles = s.profiles.filter(function (p) { return p.id !== id; }); }); }}
        onAddWord={function (c) { update(function (s) { var n = LQ.store.normalizeCustom(Object.assign({ id: LQ.store.uid('c') }, c)); if (n) s.custom.push(n); }); }}
        onDeleteWord={function (id) { update(function (s) { s.custom = s.custom.filter(function (c) { return c.id !== id; }); }); }}
        onBackedUp={function () { update(function (s) { s.settings.lastBackup = Date.now(); }); }}
        onSettings={function (o) { update(function (s) { Object.assign(s.settings, o); }); }}
        onRestore={function (data, mode) {
          var out = mode === 'replace' ? LQ.store.replaceBackup(stateRef.current, data) : LQ.store.mergeBackup(stateRef.current, data);
          update(function (s) { Object.assign(s, clone(out.state)); });
          return out;
        }} />;
    } else {
      view = <LQ.home.Picker state={state} onPick={function (id) { setScreen({ name: 'home', id: id }); }}
        onAdd={function () { setGate({ what: 'adding a learner', next: { name: 'form', mode: 'add', back: { name: 'picker' } } }); }} />;
    }

    return <div className="app">
      {view}
      {gate ? <ui.ParentGate what={gate.what} onCancel={function () { setGate(null); }} onPass={function () { setScreen(gate.next); setGate(null); }} /> : null}
      {coopSetup ? <CoopSetup state={state} onClose={function () { setCoopSetup(false); }}
        onStart={function (ids, lang) { setCoopSetup(false); setScreen({ name: 'coop', players: ids, lang: lang, back: Object.assign({}, screen, { tab: 'family' }) }); }} /> : null}
      {voiceWarn ? <VoiceWarning names={voiceWarn} onClose={function () { setVoiceWarn(null); }} /> : null}
      <input ref={restoreRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={onRestoreFile} aria-label="Backup file" />
    </div>;
  }

  LQ.App = App;
  LQ.buildReview = buildReview;
  var rootEl = document.getElementById('root');
  if (rootEl && !LQ.noAutoMount) ReactDOM.createRoot(rootEl).render(<App />);
})(window.LQ = window.LQ || {});
