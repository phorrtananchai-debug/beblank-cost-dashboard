# Static BOQ Import Workflow

This app uses static project data. There is no backend import pipeline yet.

## 1. Generate BOQ analysis JSON

Ask AI, NotebookLM, or another review tool to return one project object that matches `src/data/importTemplate.json`.

Keep these rules:

- Use numbers for money, percentages, quantities, and area values.
- Do not include commas, currency symbols, or text inside numeric fields.
- Use negative values for cost reductions in `deltaAmount` and `revisionDelta.items`.
- Put owner-safe explanations in `ownerSummary`.
- Put private strategy in `internalNotes`.
- If a field is unknown, keep the field and use `null`, an empty string, or an empty array.

## 2. Review the JSON

Before pasting it into the app, check:

- `id` is unique and URL-safe, such as `brand-branch-rev01`.
- `projectName`, `brand`, `branch`, `revision`, and `status` are filled in.
- `costBreakdown` totals are sensible against `currentBudget`.
- `revisionDelta.items` clearly shows increases and reductions.
- `risks` are owner-readable.
- Set `risks[].ownerVisible` to `true` only for risks that can appear in the owner presentation.
- Add owner-supplied fixtures, equipment, or materials to `ownerSupplyItems`.
- `internalNotes` does not contain text you want visible in Owner View.

## 3. Add it to `src/data/projects.js`

1. Open `src/data/projects.js`.
2. Paste the new object into the exported `projects` array.
3. Keep the same property names used in `src/data/importTemplate.json`.
4. Save the file.

## 4. Validate in development

Run:

```bash
npm.cmd run dev
```

When the dashboard loads in development, `src/utils/validateProjectData.js` checks each project for required fields and logs a warning if any are missing.

Then run:

```bash
npm.cmd run lint
npm.cmd run build
```

## 5. Expected schema summary

Each project should include:

- `id`
- `projectName`
- `brand`
- `branch`
- `revision`
- `status`
- `currentBudget`
- `previousBudget`
- `deltaAmount`
- `deltaPercent`
- `lastUpdated`
- `costBreakdown`
- `revisionDelta`
- `risks`
- `negotiationChecklist`
- `ownerSummary`
- `internalNotes`
