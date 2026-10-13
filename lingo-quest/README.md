# Lingo Quest

A free, offline family app for learning Chinese first, with Spanish and Northern Vietnamese as options. Up to 4 learners, each with their own age band, languages, stars, stickers and spaced-repetition progress. Built on the Chess Quest stack: React with in-browser Babel, no bundler, no build step, localStorage only.

## Deploy to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → **Upload assets**.
2. Name the project (for example `lingoquest`) and drag in this folder (the one holding `index.html`).
3. Open `https://<project>.pages.dev` on each phone, then **Share → Add to Home Screen** (iPhone) or **Install app** (Android). After the first visit it works offline.

To update: upload the folder again as a new deployment. Bump `VERSION` in `sw.js` first so installed phones fetch the new files.

## Files

| Path | What it holds |
| --- | --- |
| `js/data/languages.js` | `UNITS` (shared concepts) and the `LANGUAGES` registry: words, tips, dialogues per language |
| `js/data/pictures.js` | SVG picture cards and the six animal avatars |
| `js/core/tones.js` | Tone detection, colouring and tone-variant questions for pinyin and Vietnamese |
| `js/core/content.js` | Word lookup, custom words, word of the day |
| `js/core/srs.js` | Spaced repetition (Leitner boxes) |
| `js/core/storage.js` | State, profiles (max 4), streaks, backup export, merge and replace |
| `js/core/questions.js` | Question types per age band, typed-answer checking, stars |
| `js/core/speech.js` | Device voices and optional "say it" practice |
| `js/ui/*.jsx`, `js/app.jsx` | Screens |
| `vendor/` | React 18.3.1 and Babel standalone 7, so nothing loads from a CDN |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installable, offline PWA |

## Adding content

- **A language:** add one entry to `LANGUAGES` with a word for every concept, a tip and a dialogue per unit. Set `tones` to `'pinyin'`, `'vietnamese'` or `null`.
- **A unit:** add one entry to `UNITS` (8 concepts and an `emblem`), its words, tip and dialogue in each language, and a picture per concept in `pictures.js`. The map, sticker book and tests pick it up from the registry.

## Tests

The `lingo-quest-tests` folder sits beside this one (keep it out of the Cloudflare upload). `unit.test.js` covers content integrity, tones, questions, spaced repetition, storage and backups; `ui.test.js` runs full flows in jsdom; `every-unit.test.js` plays every unit in every language for every learning style and checks each screen.

```
cd lingo-quest-tests
npm install
npm test
```

## Notes

- Audio uses each phone's built-in voices. The app warns once if a language has no voice; Parent area › Backup lists the voices it found.
- Speech recognition ("say it") works in Chrome and Safari. Pre-readers never see it.
- Backups are JSON files. Restore offers Merge (keep the best progress) or Replace.
