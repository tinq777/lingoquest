/* Lingo Quest — lessons: learn, practise, tip, dialogue, checkpoint. */
(function (LQ) {
  'use strict';
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef, useMemo = React.useMemo;
  var ui = LQ.ui, Icon = ui.Icon, Pic = ui.Pic, WordText = ui.WordText, SpeakBtn = ui.SpeakBtn, ToneText = ui.ToneText;

  var PRAISE = ['Great!', 'Yes!', 'Brilliant!', 'Super!', 'Well done!'];
  var TRY = ['Try again', 'Nearly! Try again', 'Have another go'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function say(word, opts) { return LQ.speech.speak(word.t, word.lang, opts); }

  function LessonTop(props) {
    return <div className="lesson-top">
      <button className="icon-btn" aria-label="Leave" onClick={props.onExit}><Icon name="close" /></button>
      <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(props.pct * 100)}><i style={{ width: Math.round(props.pct * 100) + '%' }} /></div>
      {props.label ? <span className="step-name">{props.label}</span> : null}
    </div>;
  }

  /* ---------- One question, retry until correct ---------- */
  function QuestionView(props) {
    var q = props.q, band = props.band, w = q.word;
    if (LQ.debug) LQ.debug.q = q;
    var mastered = props.isMastered ? props.isMastered(w) : false;
    var wrongS = useState({}), wrong = wrongS[0], setWrong = wrongS[1];
    var doneS = useState(false), done = doneS[0], setDone = doneS[1];
    var selS = useState(null), sel = selS[0], setSel = selS[1];
    var fbS = useState(''), fb = fbS[0], setFb = fbS[1];
    var typedS = useState(''), typed = typedS[0], setTyped = typedS[1];
    var noteS = useState(''), note = noteS[0], setNote = noteS[1];
    var attempts = useRef(1);
    var finished = useRef(false);

    useEffect(function () {
      attempts.current = 1; finished.current = false;
      setWrong({}); setDone(false); setSel(null); setFb(''); setTyped(''); setNote('');
      if (q.kind === 'listen-pic' || q.kind === 'listen-type' || q.kind === 'tone') {
        var t = setTimeout(function () { say(w); }, 250);
        return function () { clearTimeout(t); };
      }
    }, [q.id]);

    function finish() {
      if (finished.current) return;
      finished.current = true;
      props.onDone(attempts.current);
    }
    function right(key) {
      setDone(true); setFb(pick(PRAISE)); setSel(key);
      say(w);
      if (props.onFirst) props.onFirst(attempts.current === 1);
      setTimeout(finish, band === 'pre' ? 1500 : 1300);
    }
    function miss(key) {
      attempts.current += 1;
      var m = Object.assign({}, wrong); m[key] = true; setWrong(m);
      setFb(pick(TRY));
    }
    function choose(key) {
      if (done || wrong[key]) return;
      if (key === q.answer) right(key); else miss(key);
    }

    var title, prompt, body;
    var opts = q.options || [];
    function optClass(key) { return 'opt' + (done && key === q.answer ? ' right pop' : '') + (wrong[key] ? ' wrong shake' : '') + (sel === key && !done ? ' sel' : ''); }

    if (q.kind === 'listen-pic') {
      title = band === 'pre' ? null : 'Tap what you hear';
      prompt = <button className="big-speaker" aria-label="Play the word again" onClick={function () { say(w); }}><Icon name="speaker" /></button>;
      body = <div className={'options pics' + (opts.length === 3 ? ' three' : '')}>
        {opts.map(function (o) { return <button key={o.key} data-key={o.key} className={optClass(o.key)} aria-label={band === 'pre' ? 'Picture' : o.word.en} onClick={function () { choose(o.key); }}><Pic svg={o.word.pic} /></button>; })}
      </div>;
    } else if (q.kind === 'pic-sound') {
      prompt = <div className="prompt-pic"><Pic svg={w.pic} /></div>;
      body = <div className="list grow">
        <div className="options pics" style={{ gridTemplateColumns: '1fr 1fr', flex: 'none', height: '34%' }}>
          {opts.map(function (o, i) {
            return <button key={o.key} data-key={o.key} className={optClass(o.key) + ' sound'} aria-label={'Sound ' + (i + 1)}
              onClick={function () { if (done || wrong[o.key]) return; setSel(o.key); say(o.word); }}>
              <Icon name="speaker" /><span>{i === 0 ? 'A' : 'B'}</span></button>;
          })}
        </div>
        <button className="btn jade block" disabled={!sel || done} aria-label="Choose this sound" onClick={function () { choose(sel); }}><Icon name="check" /></button>
      </div>;
    } else if (q.kind === 'word-pic') {
      title = 'Which picture?';
      prompt = <div className="row" style={{ justifyContent: 'center' }}><WordText word={w} size={44} mastered={mastered} /><SpeakBtn text={w.t} lang={w.lang} /></div>;
      body = <div className="options pics">
        {opts.map(function (o) { return <button key={o.key} data-key={o.key} className={optClass(o.key)} aria-label={o.word.en} onClick={function () { choose(o.key); }}><Pic svg={o.word.pic} /></button>; })}
      </div>;
    } else if (q.kind === 'pic-word') {
      title = 'Which word?';
      prompt = <div className="prompt-pic"><Pic svg={w.pic} label={w.en} /></div>;
      body = <div className="options list">
        {opts.map(function (o) { return <button key={o.key} data-key={o.key} className={optClass(o.key)} onClick={function () { choose(o.key); }}><WordText word={o.word} size={28} mastered={mastered} /></button>; })}
      </div>;
    } else if (q.kind === 'word-meaning') {
      title = 'What does it mean?';
      prompt = <div className="row" style={{ justifyContent: 'center' }}><WordText word={w} size={44} mastered={mastered} /><SpeakBtn text={w.t} lang={w.lang} /></div>;
      body = <div className="options list">
        {opts.map(function (o) { return <button key={o.key} data-key={o.key} className={optClass(o.key)} onClick={function () { choose(o.key); }}>{o.word.en}</button>; })}
      </div>;
    } else if (q.kind === 'meaning-word') {
      title = 'How do you say';
      prompt = <div className="row" style={{ justifyContent: 'center' }}><span className="prompt-pic" style={{ width: 'min(14vh, 90px)' }}><Pic svg={w.pic} /></span><h2>“{w.en}”</h2></div>;
      body = <div className="options list">
        {opts.map(function (o) { return <button key={o.key} data-key={o.key} className={optClass(o.key)} onClick={function () { choose(o.key); }}><WordText word={o.word} size={26} mastered={mastered} /></button>; })}
      </div>;
    } else if (q.kind === 'tone') {
      title = 'Which tones did you hear?';
      prompt = <div className="row" style={{ justifyContent: 'center' }}>
        <span className="prompt-pic" style={{ width: 'min(16vh, 100px)' }}><Pic svg={w.pic} /></span>
        <div className="list" style={{ alignItems: 'flex-start' }}>
          {w.lang === 'zh' ? <span className="word zh" style={{ fontSize: 34 }}>{w.t}</span> : null}
          <span className="en">{w.en}</span>
        </div>
        <SpeakBtn text={w.t} lang={w.lang} />
      </div>;
      body = <div className="options list">
        {opts.map(function (o) { return <button key={o.key} data-key={o.key} className={optClass(o.key)} onClick={function () { choose(o.key); }}><ToneText text={o.label} system={q.system} /></button>; })}
      </div>;
    } else if (q.kind === 'listen-type') {
      title = 'Type what you hear';
      prompt = <div className="row" style={{ justifyContent: 'center' }}>
        <button className="big-speaker" style={{ width: 'min(14vh, 90px)', height: 'min(14vh, 90px)' }} aria-label="Play the word again" onClick={function () { say(w); }}><Icon name="speaker" /></button>
        <span className="prompt-pic" style={{ width: 'min(14vh, 90px)' }}><Pic svg={w.pic} /></span>
      </div>;
      var reveal = attempts.current >= 3;
      var submit = function (e) {
        e.preventDefault();
        if (done) return;
        if (reveal) { right('typed'); return; }
        var res = LQ.questions.checkTyped(typed, w);
        if (res.ok) {
          setNote(res.exact ? '' : 'Spelled exactly: ' + w.t + (w.r ? ' (' + w.r + ')' : ''));
          right('typed');
        } else { miss('typed-' + attempts.current); setTyped(''); }
      };
      body = <form className="list" onSubmit={submit}>
        <input className="input" aria-label="Your answer" autoComplete="off" autoCapitalize="off" spellCheck="false" value={typed} disabled={done}
          placeholder={w.lang === 'zh' ? 'Pinyin or characters' : 'Type the word'} onChange={function (e) { setTyped(e.target.value); }} style={{ fontSize: 22, textAlign: 'center' }} />
        {reveal && !done ? <div className="notice" style={{ textAlign: 'center' }}>It's <WordText word={w} size={24} /> — type it, or tap Got it.</div> : null}
        {note ? <div className="notice good" style={{ textAlign: 'center' }}>{note}</div> : null}
        <button type="submit" className="btn jade block" disabled={done || (!typed && !reveal)}>{reveal ? 'Got it' : 'Check'}</button>
      </form>;
    }

    return <div className="screen" style={{ paddingTop: 4 }}>
      {props.banner || null}
      {title ? <div className="question-title">{title}</div> : null}
      <div className="prompt">{prompt}</div>
      {body}
      <div className={'feedback ' + (done ? 'good' : fb ? 'try' : '')} aria-live="polite">
        {done ? <Icon name="check" /> : null}{fb}
        {done ? <button className="btn ghost sm" onClick={finish}>Next</button> : null}
      </div>
    </div>;
  }

  /* ---------- Learn: one card per word ---------- */
  function LearnStep(props) {
    var words = props.words, band = props.band;
    var iS = useState(0), i = iS[0], setI = iS[1];
    var micS = useState(''), mic = micS[0], setMic = micS[1];
    var w = words[i];
    useEffect(function () { setMic(''); var t = setTimeout(function () { say(w, { rate: band === 'pre' ? 0.75 : 0.85 }); }, 300); return function () { clearTimeout(t); }; }, [i]);
    var canMic = band !== 'pre' && LQ.speech.canListen();
    function listen() {
      setMic('Listening…');
      LQ.speech.listen(w, function (r) {
        if (r.ok) setMic('Great! I heard it.');
        else if (r.error === 'not-allowed') setMic('Microphone is blocked.');
        else setMic(band === 'early' ? 'Nice try! Listen and say it again.' : 'Not quite. Listen and try again.');
      });
    }
    var showHint = band === 'early' && w.hint;
    return <div className="screen">
      <div className="learn-card">
        <button className="learn-pic" style={{ border: 0, background: 'transparent', padding: 0 }} aria-label={'Hear ' + w.en} onClick={function () { say(w); }}><Pic svg={w.pic} /></button>
        {band !== 'pre' ? <WordText word={w} size={band === 'adult' ? 44 : 52} /> : null}
        {band !== 'pre' ? <div className="en">{w.en}</div> : null}
        {showHint ? <div className="hint">{w.hint}</div> : null}
        <div className="row">
          <button className="speak" style={{ width: 56, height: 56 }} aria-label="Play again" onClick={function () { say(w); }}><Icon name="speaker" /></button>
          {canMic ? <button className="speak" style={{ width: 56, height: 56, background: '#f1edfb' }} aria-label="Say it" onClick={listen}><Icon name="mic" /></button> : null}
        </div>
        {mic ? <div className="small muted" aria-live="polite">{mic}</div> : null}
      </div>
      <div className="dots">{words.map(function (x, n) { return <i key={n} className={n === i ? 'on' : ''} />; })}</div>
      <div className="row">
        {i > 0 ? <button className="btn" aria-label="Previous word" onClick={function () { setI(i - 1); }}><Icon name="back" /></button> : null}
        <button className="btn primary grow" onClick={function () { if (i < words.length - 1) setI(i + 1); else props.onDone(); }}>{i < words.length - 1 ? 'Next' : "Let's play"}</button>
      </div>
    </div>;
  }

  /* ---------- Tip ---------- */
  function TipStep(props) {
    var L = LQ.LANGUAGES[props.lang];
    var tip = L.tips[props.unitId];
    var info = L.tones ? LQ.tones.INFO[L.tones] : null;
    return <div className="screen">
      <div className="tip">
        <h2>{props.band === 'early' ? 'Did you know?' : 'Quick tip'}</h2>
        <div className="card tip-body">{tip}</div>
        {info ? <div className="list">
          <span className="small muted">Tone colours</span>
          <div className="legend">{Object.keys(info).map(function (k) { return <span key={k} style={{ background: info[k].color }}>{info[k].name} · {info[k].short}</span>; })}</div>
        </div> : null}
        {props.lang === 'es' ? <div className="legend"><span style={{ background: 'var(--masc)' }}>el · masculine</span><span style={{ background: 'var(--fem)' }}>la · feminine</span></div> : null}
      </div>
      <button className="btn primary block" onClick={props.onDone}>Next</button>
    </div>;
  }

  /* ---------- Dialogue ---------- */
  function lineText(line, lang, band, showEn) {
    return <span>
      <span className={'t' + (lang === 'zh' ? ' zh' : '')}>{lang === 'vi' ? <ToneText text={line.t} system="vietnamese" /> : line.t}</span>
      {line.r ? <span className="r" style={{ display: 'block' }}><ToneText text={line.r} system="pinyin" /></span> : null}
      {showEn ? <span className="e" style={{ display: 'block' }}>{line.en}</span> : null}
    </span>;
  }

  function DialogueStep(props) {
    var lang = props.lang, band = props.band;
    var lines = LQ.LANGUAGES[lang].dialogues[props.unitId];
    var nS = useState(1), n = nS[0], setN = nS[1];            // lines visible
    var wrongS = useState({}), wrong = wrongS[0], setWrong = wrongS[1];
    var enS = useState(band !== 'adult'), showEn = enS[0], setShowEn = enS[1];
    var replies = useMemo(function () {
      var me = lines[1];
      return LQ.questions.shuffle([{ t: me.t, r: me.r, en: me.en, ok: true }].concat(me.wrong.map(function (x) { return Object.assign({ ok: false }, x); })), Math.random);
    }, [props.unitId, lang]);
    var mistakes = useRef(0);
    useEffect(function () { LQ.speech.speak(lines[n - 1].t, lang); }, [n]);
    var choosing = band !== 'pre' && n === 1;
    function choose(r, i) {
      if (wrong[i]) return;
      if (r.ok) setN(2); else { mistakes.current++; var m = Object.assign({}, wrong); m[i] = true; setWrong(m); }
    }
    var visible = lines.slice(0, n);
    return <div className="screen">
      <div className="row between">
        <h3>{band === 'pre' ? 'Listen' : 'Chat'}</h3>
        {band === 'adult' ? <button className="btn ghost sm" onClick={function () { setShowEn(!showEn); }}>{showEn ? 'Hide English' : 'Show English'}</button> : null}
      </div>
      <div className="chat">
        {visible.map(function (line, i) {
          var me = line.s === 'you';
          return <div key={i} className={'bubble-row' + (me ? ' me' : '')}>
            <ui.Avatar profile={me ? props.profile : { avatar: lang === 'zh' ? 'panda' : lang === 'es' ? 'fox' : 'owl', colour: '#d3e2dc' }} size={40} />
            <button className={'bubble pop' + (band === 'pre' ? ' audio' : '')} aria-label="Play line" onClick={function () { LQ.speech.speak(line.t, lang); }}>
              {band === 'pre' ? <Icon name="speaker" /> : lineText(line, lang, band, showEn)}
            </button>
          </div>;
        })}
      </div>
      {choosing ? <div className="replies">
        <span className="small muted">Pick your reply</span>
        {replies.map(function (r, i) {
          return <button key={i} className={'reply' + (wrong[i] ? ' wrong shake' : '')} onClick={function () { choose(r, i); }}>
            {lineText(r, lang, band, showEn)}
          </button>;
        })}
      </div> : <button className="btn primary block" onClick={function () { if (n < lines.length) setN(n + 1); else props.onDone(mistakes.current); }}>
        {n < lines.length ? 'Next' : 'Continue'}</button>}
    </div>;
  }

  /* ---------- A run of questions ---------- */
  function Questions(props) {
    var iS = useState(0), i = iS[0], setI = iS[1];
    var log = useRef([]);
    var q = props.questions[i];
    if (!q) return null;
    return <QuestionView key={q.id} q={q} band={props.bandFor ? props.bandFor(i) : props.band} isMastered={props.isMastered}
      banner={props.banner ? props.banner(i) : null}
      onFirst={function (first) { props.onAnswer(q, first, i); }}
      onDone={function (attempts) {
        log.current.push(attempts);
        if (props.onProgress) props.onProgress(i + 1);
        if (i + 1 < props.questions.length) setI(i + 1); else props.onDone(log.current.slice());
      }} />;
  }

  /* ---------- Whole lesson ---------- */
  var STEPS = ['learn', 'practise', 'tip', 'dialogue', 'check', 'done'];
  var STEP_LABEL = { learn: 'Learn', practise: 'Practise', tip: 'Tip', dialogue: 'Chat', check: 'Checkpoint' };

  function Lesson(props) {
    var p = props.profile, lang = props.lang, unitId = props.unitId, band = p.band;
    var B = LQ.BANDS[band];
    var words = useMemo(function () {
      var all = LQ.content.unitWords(lang, unitId, props.custom);
      return band === 'pre' ? all.filter(function (w) { return !w.custom; }) : all;
    }, [lang, unitId]);
    var pool = useMemo(function () { return LQ.content.langWords(lang, props.custom); }, [lang]);
    var practise = useMemo(function () { return LQ.questions.buildSet(words, pool, B.practise, band); }, [words]);
    var check = useMemo(function () { return LQ.questions.buildSet(words, pool, B.check, band); }, [words]);
    var stepS = useState('learn'), step = stepS[0], setStep = stepS[1];
    var subS = useState(0), sub = subS[0], setSub = subS[1];
    var resS = useState(null), result = resS[0], setResult = resS[1];

    function next(from) {
      var order = STEPS.filter(function (s) { return !(s === 'tip' && band === 'pre'); });
      setSub(0);
      setStep(order[order.indexOf(from) + 1]);
    }
    var isMastered = function (w) { var s = (p.srs[w.lang] || {})[w.id]; return LQ.srs.isMastered(s); };
    var stepIdx = ['learn', 'practise', 'tip', 'dialogue', 'check'].indexOf(step);
    var within = step === 'practise' ? sub / practise.length : step === 'check' ? sub / check.length : 0;
    var pct = step === 'done' ? 1 : (stepIdx + within) / 5;

    if (step === 'done' && result) {
      var u = LQ.unitById(unitId);
      return <div className="screen center">
        <h1>{result.stars === 3 ? 'Amazing!' : result.stars === 2 ? 'Great job!' : 'You did it!'}</h1>
        <div className="result-stars pop"><ui.Stars n={result.stars} /></div>
        <div className="row" style={{ justifyContent: 'center' }}><span className="pill"><Icon name="coin" />+{result.coins}</span></div>
        {result.sticker ? <div className="list" style={{ alignItems: 'center' }}>
          <div className="sticker-new pop"><Pic svg={LQ.PICTURES[u.emblem]} /></div>
          <b>New sticker: {u.title}</b>
        </div> : null}
        <button className="btn primary block" onClick={props.onExit}>Back to the map</button>
        {result.stars < 3 ? <button className="btn block" onClick={props.onRetry}>Play again</button> : null}
      </div>;
    }

    var content = null;
    if (step === 'learn') content = <LearnStep words={words} band={band} onDone={function () { next('learn'); }} />;
    if (step === 'practise') content = <Questions questions={practise} band={band} isMastered={isMastered}
      onProgress={setSub} onAnswer={function (q, first) { props.onAnswer(q.word, first); }} onDone={function () { next('practise'); }} />;
    if (step === 'tip') content = <TipStep lang={lang} unitId={unitId} band={band} onDone={function () { next('tip'); }} />;
    if (step === 'dialogue') content = <DialogueStep lang={lang} unitId={unitId} band={band} profile={p} onDone={function () { next('dialogue'); }} />;
    if (step === 'check') content = <Questions questions={check} band={band} isMastered={isMastered}
      onProgress={setSub} onAnswer={function (q, first) { props.onAnswer(q.word, first); }}
      onDone={function (attempts) {
        var stars = LQ.questions.unitStars(attempts);
        setResult(props.onComplete(stars));
        setStep('done');
      }} />;
    return <div className="grow" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <LessonTop pct={pct} label={STEP_LABEL[step]} onExit={props.onExit} />
      {content}
    </div>;
  }

  LQ.lesson = { Lesson: Lesson, Questions: Questions, QuestionView: QuestionView, LessonTop: LessonTop };
})(window.LQ = window.LQ || {});
