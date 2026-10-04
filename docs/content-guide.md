# Content guide

The reflection library is static and lives in `content/content.js`. It makes no model or API calls.

## Adding a question

Add one canonical `Question` record with a unique stable ID, plain-language premise, realistic aliases, and keywords. Add a response for every perspective by extending the content-generation inputs or replacing generated copy with a reviewed authored answer. Never silently map a user's text to a different premise.

Each answer is a modern interpretation. Keep scripture or historical text in the source record; keep contemporary application in `practice` and the clearly labeled interpretation body. Never write in first-person as a historical figure or as God.

Run:

```powershell
npm test
npm run validate
```

Use `editorial-component-review` when the question and perspective components have been checked but the exact combination has not received an individual theological review. Reserve `individual-review` for a documented review of that complete response. Unresolved content remains `draft` and must not ship.

## Editing a perspective

`figureId` identifies a person. `perspectiveId` identifies a tradition-specific lens. Abraham therefore has one identity and two perspectives. Do not merge those two answer records.

Sources need an exact work/passage, HTTPS URL, access date, and an attribution note when authorship or transmission is uncertain. Avoid quote aggregators and unattributed social posts.
