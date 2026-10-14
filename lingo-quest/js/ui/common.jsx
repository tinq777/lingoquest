/* Lingo Quest — shared UI pieces: icons, pictures, word display, parent gate. */
(function (LQ) {
  'use strict';
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;

  var PATHS = {
    speaker: <g><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></g>,
    mic: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></g>,
    star: <path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="currentColor"/>,
    coin: <g><circle cx="12" cy="12" r="9.5" fill="#ffc93c" stroke="#d9a10f" strokeWidth="2"/><path d="M12 7.5v9M9.5 9.5h4a1.6 1.6 0 0 1 0 3.2h-3a1.6 1.6 0 0 0 0 3.2h4" fill="none" stroke="#a37400" strokeWidth="1.6" strokeLinecap="round"/></g>,
    flame: <path d="M12 2.5c1 3.5 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-2.6 1.4-4 2.5-5.2.3 1.6 1 2.6 2 3-.4-3 .1-5.7 1-8.3z" fill="#ff7a1a" stroke="#d9530a" strokeWidth="1.2" strokeLinejoin="round"/>,
    lock: <g fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></g>,
    map: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></g>,
    review: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/></g>,
    sticker: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8l-6 6H6a2 2 0 0 1-2-2z"/><path d="M14 20v-4a2 2 0 0 1 2-2h4"/></g>,
    family: <g fill="currentColor"><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="12.5" r="2.3"/><path d="M2 20c0-4 2.2-6.5 5-6.5S12 16 12 20zM12 20c0-4 2.2-6.5 5-6.5S22 16 22 20z"/></g>,
    back: <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>,
    close: <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>,
    plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>,
    parent: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4" strokeLinecap="round"/></g>,
    trash: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></g>,
    edit: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></g>,
    play: <path d="M8 5l11 7-11 7z" fill="currentColor"/>,
    cloud: <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"><path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.5 10a4.25 4.25 0 0 0 .5 8.5z"/><path d="M9.5 13.5l2.5-2.5 2.5 2.5M12 11v5"/></g>
  };

  function Icon(props) {
    return <svg className={'ico ' + (props.className || '')} viewBox="0 0 24 24" aria-hidden="true" style={props.color ? { color: props.color } : null}>{PATHS[props.name]}</svg>;
  }

  function Pic(props) {
    return <span className={'pic ' + (props.className || '')} role={props.label ? 'img' : null} aria-label={props.label || null}
      dangerouslySetInnerHTML={{ __html: props.svg }} />;
  }

  function Avatar(props) {
    var size = props.size || 44;
    return <span className="avatar" style={{ width: size, height: size, borderColor: props.profile.colour }}>
      <Pic svg={LQ.AVATARS[props.profile.avatar]} />
    </span>;
  }

  function Stars(props) {
    var out = [];
    for (var i = 1; i <= 3; i++) out.push(<Icon key={i} name="star" color={i <= (props.n || 0) ? '#ffc93c' : '#d3e2dc'} />);
    return <span className="stars" aria-label={(props.n || 0) + ' of 3 stars'}>{out}</span>;
  }

  function SpeakBtn(props) {
    return <button className={'speak ' + (props.className || '')} aria-label={'Play ' + (props.label || 'sound')}
      onClick={function (e) { e.stopPropagation(); LQ.speech.speak(props.text, props.lang); }}><Icon name="speaker" /></button>;
  }

  /* Tone-coloured text for pinyin or Vietnamese. */
  function ToneText(props) {
    var sys = props.system;
    if (!sys) return <span>{props.text}</span>;
    var info = LQ.tones.INFO[sys];
    return <span>{LQ.tones.toneSpans(props.text, sys).map(function (s, i) {
      return <span key={i} style={s.tone ? { color: info[s.tone].color } : null}>{s.text}</span>;
    })}</span>;
  }

  /* A word as the learner should see it: characters with pinyin above,
     Spanish gender colours, or Vietnamese tone colours. Pinyin fades once
     mastered and comes back on tap. */
  function WordText(props) {
    var w = props.word, size = props.size || 36;
    var reveal = useState(false), shown = reveal[0], setShown = reveal[1];
    useEffect(function () { setShown(false); }, [w.key]);
    var L = LQ.LANGUAGES[w.lang];
    if (w.lang === 'zh' && w.r) {
      var chars = Array.from(w.t), syl = w.r.split(' ');
      var hide = props.mastered && !shown;
      var info = LQ.tones.INFO.pinyin;
      if (chars.length === syl.length) {
        return <span className={'word zh' + (props.mastered ? ' tap' : '')} style={{ fontSize: size }}
          onClick={props.mastered ? function (e) { e.stopPropagation(); setShown(true); } : null}
          title={hide ? 'Tap to show pinyin' : null}>
          {chars.map(function (c, i) {
            var col = info[LQ.tones.toneOf(syl[i], 'pinyin')].color;
            return <ruby key={i} style={{ color: col }}>{c}<rt className={hide ? 'hide' : ''}>{syl[i]}</rt></ruby>;
          })}
        </span>;
      }
      return <span className="word" style={{ fontSize: size }}><span className="zh">{w.t}</span> <ToneText text={w.r} system="pinyin" /></span>;
    }
    if (L && L.rtl) {
      var hideR = props.mastered && !shown;
      return <span className={'word ar-word' + (props.mastered ? ' tap' : '')} style={{ fontSize: size }}
        onClick={props.mastered ? function (e) { e.stopPropagation(); setShown(true); } : null} title={hideR ? 'Tap to show the spelling' : null}>
        <span className="ar" dir="rtl" lang="ar">{w.t}</span>
        {w.r ? <span className={'translit' + (hideR ? ' hide' : '')}>{w.r}</span> : null}
      </span>;
    }
    if (w.lang === 'es') {
      return <span className={'word' + (w.g ? ' g' + w.g : '')} style={{ fontSize: size }}>{w.t}</span>;
    }
    return <span className="word" style={{ fontSize: size }}><ToneText text={w.t} system={L ? L.tones : null} /></span>;
  }

  function Sheet(props) {
    return <div className="scrim" onClick={props.onClose} role="dialog" aria-modal="true" aria-label={props.title}>
      <div className="sheet" onClick={function (e) { e.stopPropagation(); }}>
        {props.title ? <h2>{props.title}</h2> : null}
        {props.children}
      </div>
    </div>;
  }

  /* Parent gate: a multiplication a 4- or 7-year-old is unlikely to answer. */
  function ParentGate(props) {
    var q = useRef(null);
    if (!q.current) { var a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4); q.current = { a: a, b: b }; }
    var st = useState(''), val = st[0], setVal = st[1];
    var er = useState(false), bad = er[0], setBad = er[1];
    function submit(e) {
      e.preventDefault();
      if (Number(val) === q.current.a * q.current.b) props.onPass();
      else { setBad(true); setVal(''); }
    }
    return <Sheet title="Grown-ups only" onClose={props.onCancel}>
      <p className="muted" style={{ textAlign: 'center' }}>Answer to open {props.what || 'parent settings'}.</p>
      <form onSubmit={submit} className="list">
        <div className="gate-q">{q.current.a} × {q.current.b} = ?</div>
        <input className="input" inputMode="numeric" autoFocus aria-label="Answer" value={val}
          onChange={function (e) { setVal(e.target.value.replace(/\D/g, '')); setBad(false); }} style={{ textAlign: 'center', fontSize: 24 }} />
        {bad ? <div className="notice bad">Not quite. Try again.</div> : null}
        <div className="row">
          <button type="button" className="btn grow" onClick={props.onCancel}>Cancel</button>
          <button type="submit" className="btn plum grow" disabled={!val}>Open</button>
        </div>
      </form>
    </Sheet>;
  }

  function Confirm(props) {
    return <Sheet title={props.title} onClose={props.onCancel}>
      <p style={{ textAlign: 'center' }}>{props.body}</p>
      <div className="row">
        <button className="btn grow" onClick={props.onCancel}>Cancel</button>
        <button className={'btn grow ' + (props.danger ? 'primary' : 'plum')} onClick={props.onOk}>{props.ok}</button>
      </div>
    </Sheet>;
  }

  LQ.ui = { Icon: Icon, Pic: Pic, Avatar: Avatar, Stars: Stars, SpeakBtn: SpeakBtn, ToneText: ToneText, WordText: WordText, Sheet: Sheet, ParentGate: ParentGate, Confirm: Confirm };
})(window.LQ = window.LQ || {});
