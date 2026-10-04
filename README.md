# Awakening & Dispersion

A static class project for comparing prepared Buddhist, Christian, and Islamic perspectives on difficult life questions.

The main experience has 18 prepared questions and 18 interpretive lenses: 324 responses. Search is deterministic and runs in the browser. The project has no runtime AI, API key, user account, server database, analytics, or per-question cost.

Each answer is labeled as a **modern interpretation inspired by cited material**. It is not a historical quotation, revelation, personal reply, or claim that a figure represents an entire religion.

## Run locally

ES modules need a local HTTP server. From this directory:

```powershell
python -m http.server 8000
```

Open <http://localhost:8000>. On Windows, `Launch_With_Server.bat` starts the same server and opens the site.

## Experiences

- `index.html`: questions, local search, comparison, figures, and methodology.
- `journeys.html`: the preserved historical Leaflet map and local map-data editor.

The map depends on online Leaflet resources and map tiles. The repository does not contain the audio files referenced by the original prototype, so unavailable background-music controls are hidden. Browser text-to-speech remains available as **Read this story aloud**.

## Verify

No dependency installation is required.

```powershell
npm test
npm run validate
```

The test suite verifies search behavior and the 18 × 18 content matrix. The validator checks IDs, coverage, source references, word bounds, review status, HTTPS source URLs, and exact duplicate answer bodies.

## Content and architecture

- `content/content.js`: questions, figures, perspective lenses, sources, and answer matrix.
- `js/search.js`: deterministic local question matcher.
- `js/main.js`: hash routing and safe DOM rendering.
- `styles/reflections.css`: warm neutral, responsive interface.
- `docs/content-guide.md`: editing and attribution rules.
- `docs/content-review.md`: current review status and limitations.
- `data.js`, `app.js`, `style.css`: preserved map application.

Search text stays in memory and is not placed in URLs or sent to an AI service. Hosting still receives ordinary page and asset requests; external sources and the map use the network.

## Static hosting

The project uses relative paths and can be hosted under a repository subpath such as `/Religion_web/`. GitHub Pages is suitable for a public classroom project. Publishing and repository settings are separate from local implementation.
