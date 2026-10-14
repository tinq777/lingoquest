const fs = require('fs'), path = require('path'), Babel = require('@babel/standalone');
const A = '/home/claude/lingo-quest';
const css = fs.readFileSync(A + '/css/app.css', 'utf8');
const plain = ['data/languages', 'data/worlds-3-5', 'data/pictures', 'data/pictures-3-5', 'core/tones', 'core/content', 'core/srs', 'core/storage', 'core/questions', 'core/speech', 'core/sfx', 'core/sync'].map(f => fs.readFileSync(`${A}/js/${f}.js`, 'utf8'));
const jsx = ['ui/common', 'ui/lesson', 'ui/home', 'ui/parent', 'app'].map(f => Babel.transform(fs.readFileSync(`${A}/js/${f}.jsx`, 'utf8'), { presets: ['react'] }).code);
const js = plain.concat(jsx).join('\n;\n');
if (/<\/script/i.test(js)) throw new Error('script close tag in source');
const html = `<title>Lingo Quest</title>
<meta name="theme-color" content="#e6f4ef">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Baloo+Bhaijaan+2:wght@500;700;800&display=swap">
<style>
${css}
</style>
<div id="root"><div id="boot" class="boot"><div class="boot-title">Lingo Quest</div><div id="boot-msg" class="boot-msg">Loading…</div></div></div>
<script>
${fs.readFileSync(A + '/js/boot.js', 'utf8')}
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>
${js}
</script>
`;
fs.writeFileSync('/home/claude/preview/lingo-quest.html', html);
console.log('bytes', html.length);
