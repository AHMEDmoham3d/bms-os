# Fix NotesReportTable.tsx TypeScript Errors + Real PieChart

## Steps:
- [x] 1. Add `import PieChart from './PieChart';` to imports
- [x] 2. Remove malformed SVG after `<PieChart />` in charts section, fix motion.div closing
- [x] 3. Fix table row missing `<` on first `<td>`
- [x] 4. Clean trailing stray JSX/code after component end
- [x] 5. Replace decorative PieChart with real data-driven donut chart
  - Accepts `notes` and `categories` props
  - Computes note count per category
  - Renders actual SVG slices with correct angles
  - Shows total notes in center + legend with counts & percentages
- [x] 6. Pass `notes` and `categories` from `NotesReportTable` to `PieChart`
- [x] 7. TypeScript check passed (`npx tsc --noEmit` => TS OK)

Status: Completed.
