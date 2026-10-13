/* Lingo Quest — welcome, profile picker, profile form and the home tabs. */
(function (LQ) {
  'use strict';
  var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo;
  var ui = LQ.ui, Icon = ui.Icon, Pic = ui.Pic, Avatar = ui.Avatar, Stars = ui.Stars, WordText = ui.WordText;

  function Welcome(props) {
    return <div className="screen center" style={{ gap: 18 }}>
      <div style={{ width: 120, height: 120 }}><Pic svg={LQ.AVATARS.panda} /></div>
      <div className="hero-title">Lingo Quest</div>
      <p className="muted" style={{ maxWidth: 300 }}>Learn <span className="zh">中文</span>, Spanish, Vietnamese and Arabic together, a few minutes a day.</p>
      <button className="btn primary block" onClick={props.onStart}>Set up the first learner</button>
      {props.onImport ? <button className="btn ghost block" onClick={props.onImport}>Restore from a backup</button> : null}
      {props.error ? <div className="notice bad" role="status">{props.error}</div> : null}
    </div>;
  }

  /* Create or edit a learner. */
  function ProfileForm(props) {
    var init = props.profile || {};
    var nameS = useState(init.name || ''), name = nameS[0], setName = nameS[1];
    var avS = useState(init.avatar || 'panda'), avatar = avS[0], setAvatar = avS[1];
    var colS = useState(init.colour || LQ.store.COLOURS[props.index % LQ.store.COLOURS.length]), colour = colS[0], setColour = colS[1];
    var bandS = useState(init.band || 'adult'), band = bandS[0], setBand = bandS[1];
    var langS = useState(init.langs || [LQ.defaultLang()]), langs = langS[0], setLangs = langS[1];
    function toggleLang(id) {
      var has = langs.indexOf(id) >= 0;
      if (has && langs.length === 1) return;
      setLangs(has ? langs.filter(function (l) { return l !== id; }) : LQ.langList().map(function (l) { return l.id; }).filter(function (l) { return l === id || langs.indexOf(l) >= 0; }));
    }
    var ok = name.trim().length > 0;
    return <div className="screen">
      <div className="row">
        <button className="icon-btn" aria-label="Back" onClick={props.onCancel}><Icon name="back" /></button>
        <h2>{props.profile ? 'Edit learner' : 'New learner'}</h2>
      </div>
      <label className="field"><span>Name</span>
        <input className="input" value={name} maxLength={16} placeholder="Name" onChange={function (e) { setName(e.target.value); }} /></label>
      <div className="field"><span>Animal</span>
        <div className="choices">{Object.keys(LQ.AVATARS).map(function (a) {
          return <button key={a} className={'choice' + (a === avatar ? ' on' : '')} aria-label={a} aria-pressed={a === avatar} onClick={function () { setAvatar(a); }}>
            <span style={{ display: 'block', width: 38, height: 38 }}><Pic svg={LQ.AVATARS[a]} /></span></button>;
        })}</div></div>
      <div className="field"><span>Colour</span>
        <div className="choices">{LQ.store.COLOURS.map(function (c) {
          return <button key={c} className={'swatch' + (c === colour ? ' on' : '')} style={{ background: c }} aria-label={'Colour ' + c} aria-pressed={c === colour} onClick={function () { setColour(c); }} />;
        })}</div></div>
      <div className="field"><span>Learning style</span>
        <div className="seg">{Object.keys(LQ.BANDS).map(function (b) {
          return <button key={b} className={b === band ? 'on' : ''} aria-pressed={b === band} onClick={function () { setBand(b); }}>{LQ.BANDS[b].label}</button>;
        })}</div>
        <span className="small muted">{LQ.BANDS[band].blurb}</span></div>
      <div className="field"><span>Languages</span>
        <div className="langs">{LQ.langList().map(function (L) {
          var on = langs.indexOf(L.id) >= 0;
          return <button key={L.id} className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={function () { toggleLang(L.id); }}>
            {on ? <Icon name="check" /> : null}{L.name}</button>;
        })}</div></div>
      <div className="grow" />
      <button className="btn primary block" disabled={!ok} onClick={function () {
        props.onSave({ name: name.trim(), avatar: avatar, colour: colour, band: band, langs: langs });
      }}>{props.profile ? 'Save changes' : 'Add learner'}</button>
    </div>;
  }

  function Picker(props) {
    var s = props.state, today = LQ.store.dayKey();
    var fam = LQ.store.familyStreak(s.profiles, today);
    return <div className="screen center" style={{ gap: 16 }}>
      <h1>Who's playing?</h1>
      <div className="who-grid">
        {s.profiles.map(function (p) {
          return <button key={p.id} className="who-card" onClick={function () { props.onPick(p.id); }}>
            <Avatar profile={p} size={72} />
            <span>{p.name}</span>
            <span className="band-tag">{p.langs.map(function (l) { return LQ.LANGUAGES[l].name; }).join(', ')}</span>
          </button>;
        })}
        {s.profiles.length < LQ.store.MAX_PROFILES ? <button className="who-card add" onClick={props.onAdd}>
          <Icon name="plus" /><span>Add learner</span></button> : null}
      </div>
      {s.profiles.length > 1 ? <div className="pill"><Icon name="flame" />Family streak: {fam} {fam === 1 ? 'day' : 'days'}</div> : null}
    </div>;
  }

  /* ---------- Home tabs ---------- */
  var STONES = [[27, 11], [71, 30], [29, 50], [71, 69], [31, 89]];

  function unitIndex(id) { return LQ.UNITS.findIndex(function (u) { return u.id === id; }); }
  function firstOpenIndex(p, lang) {
    for (var i = 0; i < LQ.UNITS.length; i++) if (!(p.stars[lang + ':' + LQ.UNITS[i].id] > 0)) return i;
    return -1;
  }
  /* The world holding the learner's next unit, or the last world when all are done. */
  function currentWorld(p, lang) {
    var i = firstOpenIndex(p, lang);
    var w = i < 0 ? null : LQ.worldOf(LQ.UNITS[i].id);
    return (w || LQ.WORLDS[LQ.WORLDS.length - 1]).id;
  }

  function WorldBar(props) {
    var p = props.profile, lang = p.lang;
    return <div className="seg worlds" role="tablist" aria-label="Worlds">{LQ.WORLDS.map(function (w, n) {
      var open = LQ.store.unitUnlocked(p, lang, unitIndex(w.units[0]));
      var stars = w.units.reduce(function (a, u) { return a + (p.stars[lang + ':' + u] || 0); }, 0);
      return <button key={w.id} role="tab" aria-selected={props.world === w.id} className={props.world === w.id ? 'on' : ''}
        onClick={function () { props.onPick(w.id); }}>
        {open ? null : <Icon name="lock" />}{w.title}<span className="world-stars">{stars}/{w.units.length * 3}</span></button>;
    })}</div>;
  }

  function MapTab(props) {
    var p = props.profile, lang = p.lang;
    var world = LQ.WORLDS.filter(function (w) { return w.id === props.world; })[0] || LQ.WORLDS[0];
    var firstOpen = firstOpenIndex(p, lang);
    var d = STONES.map(function (pt, i) { return (i ? 'L' : 'M') + pt[0] + ' ' + pt[1]; }).join(' ');
    return <div className="map" aria-label={world.title + ' map'}>
      <svg className="trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={d} fill="none" stroke="#9fc4b6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 12" vectorEffect="non-scaling-stroke" />
      </svg>
      {world.units.map(function (uid, slot) {
        var u = LQ.unitById(uid), i = unitIndex(uid);
        var stars = p.stars[lang + ':' + u.id] || 0;
        var open = LQ.store.unitUnlocked(p, lang, i);
        var cls = 'stone' + (stars > 0 ? ' done' : '') + (i === firstOpen ? ' next' : '') + (!open ? ' locked' : '');
        return <button key={u.id} className={cls} style={{ left: STONES[slot][0] + '%', top: STONES[slot][1] + '%' }}
          disabled={!open} aria-label={u.title + (open ? ', ' + stars + ' stars' : ', locked')}
          onClick={function () { props.onStart(u.id); }}>
          <span className="disc"><Pic svg={LQ.PICTURES[u.emblem]} /></span>
          <span className="label row" style={{ gap: 4 }}>{open ? null : <Icon name="lock" />}{u.title}{stars ? <Stars n={stars} /> : null}</span>
        </button>;
      })}
    </div>;
  }

  function LangBar(props) {
    var p = props.profile;
    var missing = LQ.langList().filter(function (L) { return p.langs.indexOf(L.id) < 0; });
    return <div className="langs">
      {p.langs.map(function (id) {
        var L = LQ.LANGUAGES[id];
        return <button key={id} className={'chip' + (p.lang === id ? ' on' : '')} aria-pressed={p.lang === id} onClick={function () { props.onSwitch(id); }}>
          {L.name}</button>;
      })}
      {missing.length ? <button className="chip" onClick={props.onAddLang} aria-label="Add a language"><Icon name="plus" /></button> : null}
    </div>;
  }

  function AddLangSheet(props) {
    var missing = LQ.langList().filter(function (L) { return props.profile.langs.indexOf(L.id) < 0; });
    return <ui.Sheet title="Learn another language" onClose={props.onClose}>
      <div className="list">{missing.map(function (L) {
        return <button key={L.id} className="item" style={{ border: 0, textAlign: 'left' }} onClick={function () { props.onAdd(L.id); }}>
          <span className="grow"><b>{L.name}</b><br /><span className="small muted">{L.variant}</span></span>
          <span className={'btn sm jade'}>Add</span>
        </button>;
      })}</div>
      <p className="small muted" style={{ textAlign: 'center' }}>Your progress in every language is kept when you switch.</p>
    </ui.Sheet>;
  }

  function ReviewTab(props) {
    var p = props.profile, now = Date.now();
    var rows = p.langs.map(function (l) {
      var srsL = p.srs[l] || {};
      return { lang: l, seen: Object.keys(srsL).length, due: LQ.srs.dueIds(srsL, now).length, weak: LQ.srs.weakest(srsL, 3) };
    });
    var seen = rows.reduce(function (a, r) { return a + r.seen; }, 0);
    var due = rows.reduce(function (a, r) { return a + r.due; }, 0);
    if (!seen) return <div className="screen center"><h2>Nothing to review yet</h2><p className="muted">Finish a lesson on the map and your words will come back here.</p></div>;
    var weak = [];
    rows.forEach(function (r) { r.weak.forEach(function (x) { var w = LQ.content.wordByKey(r.lang + ':' + x.id, props.custom); if (w) weak.push(w); }); });
    return <div className="screen">
      <h2>Daily review</h2>
      <div className="card list">
        {rows.map(function (r) {
          return <div key={r.lang} className="row between"><b>{LQ.LANGUAGES[r.lang].name}</b><span className="muted">{r.due} due · {r.seen} learned</span></div>;
        })}
      </div>
      <button className="btn primary block" onClick={props.onStart}>{due ? 'Review ' + Math.min(due, LQ.BANDS[p.band].review) + ' words' : 'Practise anyway'}</button>
      {weak.length ? <div className="list grow" style={{ overflow: 'hidden' }}>
        <h3>Words to practise</h3>
        {weak.slice(0, 4).map(function (w) {
          return <div key={w.key} className="item">
            <span style={{ width: 44, height: 44 }}><Pic svg={w.pic} /></span>
            <span className="grow">{p.band === 'pre' ? null : <WordText word={w} size={22} />}</span>
            <ui.SpeakBtn text={w.t} lang={w.lang} />
          </div>;
        })}
      </div> : <p className="muted">No tricky words right now.</p>}
    </div>;
  }

  function StickersTab(props) {
    var p = props.profile;
    var langS = useState(p.lang), lang = langS[0], setLang = langS[1];
    var total = LQ.langList().length * LQ.UNITS.length;
    var got = p.stickers.filter(function (k) { return LQ.LANGUAGES[k.split(':')[0]] && LQ.unitById(k.split(':')[1]); }).length;
    return <div className="screen">
      <div className="row between"><h2>Sticker book</h2><span className="pill">{got} / {total}</span></div>
      <div className={'seg' + (LQ.langList().length > 3 ? ' seg-4' : '')}>{LQ.langList().map(function (L) {
        return <button key={L.id} className={L.id === lang ? 'on' : ''} aria-pressed={L.id === lang} onClick={function () { setLang(L.id); }}>{L.name}</button>;
      })}</div>
      <div className="list grow" style={{ gap: 12 }}>{LQ.WORLDS.map(function (w) {
        return <div key={w.id} className="book-row">
          <b>{w.title}</b>
          <div className="book">{w.units.map(function (uid) {
            var u = LQ.unitById(uid), have = p.stickers.indexOf(lang + ':' + uid) >= 0;
            return have ? <div key={uid} className="slot pop" title={u.title}><Pic svg={LQ.PICTURES[u.emblem]} label={u.title} /></div>
              : <div key={uid} className="slot empty" aria-label={u.title + ' sticker not yet earned'}>?</div>;
          })}</div>
        </div>;
      })}</div>
      <p className="small muted">Finish a lesson to earn its sticker.</p>
    </div>;
  }

  function FamilyTab(props) {
    var s = props.state, today = LQ.store.dayKey();
    var wotd = useMemo(function () { return LQ.content.wordOfDay(today); }, [today]);
    var fam = LQ.store.familyStreak(s.profiles, today);
    var zh = wotd.words.filter(function (w) { return w.lang === 'zh'; })[0];
    var others = wotd.words.filter(function (w) { return w.lang !== 'zh'; });
    return <div className="screen">
      <h2>Family</h2>
      <div className="card">
        <span className="small muted">Word of the day</span>
        <div className="wotd">
          <Pic svg={zh.pic} />
          <div className="wotd-words">
            <div className="wotd-line"><WordText word={zh} size={30} /><ui.SpeakBtn text={zh.t} lang="zh" /></div>
            <span className="en">{wotd.en}</span>
            {others.map(function (w) {
              return <div key={w.lang} className="wotd-line small"><b>{LQ.LANGUAGES[w.lang].name}:</b> <WordText word={w} size={w.lang === 'ar' ? 22 : 16} /><ui.SpeakBtn text={w.t} lang={w.lang} /></div>;
            })}
          </div>
        </div>
      </div>
      <div className="card list">
        <div className="row between"><b>Family streak</b><span className="pill"><Icon name="flame" />{fam} {fam === 1 ? 'day' : 'days'}</span></div>
        <div className="row wrap">{s.profiles.map(function (p) {
          var did = p.days.indexOf(today) >= 0;
          return <span key={p.id} className="row" style={{ gap: 4, opacity: did ? 1 : 0.5 }}>
            <Avatar profile={p} size={30} /><span className="small">{did ? 'done' : 'not yet'}</span></span>;
        })}</div>
        <span className="small muted">The streak grows on days when everyone practises.</span>
      </div>
      <div className="grow" />
      {s.profiles.length > 1 ? <button className="btn sun block" onClick={props.onCoop}><Icon name="family" />Play together</button> : null}
      <button className="btn plum block" onClick={props.onParent} style={{ position: 'relative' }}>
        <Icon name="parent" />Parent area{props.backupDue ? <span className="dot" style={{ top: -3, right: -3 }} /> : null}</button>
    </div>;
  }

  function Home(props) {
    var p = props.profile, s = props.state;
    var tabS = useState(props.tab || 'map'), tab = tabS[0], setTab = tabS[1];
    var addS = useState(false), adding = addS[0], setAdding = addS[1];
    var worldS = useState(null), worldPick = worldS[0], setWorld = worldS[1];
    var world = worldPick || currentWorld(p, p.lang);
    useEffect(function () { if (props.onTab) props.onTab(tab); }, [tab]);
    var streak = LQ.store.streak(p, LQ.store.dayKey());
    var backupDue = LQ.store.backupOverdue(s);
    var body;
    if (tab === 'map') body = <div className="screen">
      <LangBar profile={p} onSwitch={function (l) { setWorld(null); props.onSwitchLang(l); }} onAddLang={function () { setAdding(true); }} />
      <WorldBar profile={p} world={world} onPick={setWorld} />
      <MapTab profile={p} world={world} onStart={props.onStartUnit} />
    </div>;
    if (tab === 'review') body = <ReviewTab profile={p} custom={s.custom} onStart={props.onReview} />;
    if (tab === 'stickers') body = <StickersTab profile={p} />;
    if (tab === 'family') body = <FamilyTab state={s} backupDue={backupDue} onCoop={props.onCoop} onParent={props.onParent} />;
    var TABS = [['map', 'Map', 'map'], ['review', 'Review', 'review'], ['stickers', 'Stickers', 'sticker'], ['family', 'Family', 'family']];
    return <React.Fragment>
      <div className="topbar">
        <button className="who" onClick={props.onSwitchProfile} aria-label="Switch learner"><Avatar profile={p} size={42} /><span className="name">{p.name}</span></button>
        <div className="pills">
          <span className="pill" aria-label={streak + ' day streak'}><Icon name="flame" />{streak}</span>
          <span className="pill" aria-label={LQ.store.totalStars(p) + ' stars'}><Icon name="star" color="#ffc93c" />{LQ.store.totalStars(p)}</span>
          <span className="pill" aria-label={p.coins + ' coins'}><Icon name="coin" />{p.coins}</span>
        </div>
      </div>
      {body}
      <nav className="tabs">{TABS.map(function (t) {
        return <button key={t[0]} className={'tab' + (tab === t[0] ? ' on' : '')} aria-current={tab === t[0] ? 'page' : null} onClick={function () { setTab(t[0]); }}>
          <Icon name={t[2]} />{t[1]}</button>;
      })}</nav>
      {adding ? <AddLangSheet profile={p} onClose={function () { setAdding(false); }} onAdd={function (id) { setAdding(false); setWorld(null); props.onAddLang(id); }} /> : null}
    </React.Fragment>;
  }

  LQ.home = { Welcome: Welcome, ProfileForm: ProfileForm, Picker: Picker, Home: Home };
})(window.LQ = window.LQ || {});
