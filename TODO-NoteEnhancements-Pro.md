# Notes Pro Tools Enhancement TODO

## Status: 📋 Planning

### 1. ✅ Create TODO & Plan Approved

### Plan Summary
**Goal**: Add enterprise-grade tools to notes (tags, priority, templates, export, list search/sort/pin).

**Files**:
- `src/lib/types.ts`: Add `tags: string[]`, `priority: 'low'|'medium'|'high'`, `pinned: boolean`, `template?: string`.
- `NoteForm.tsx`/`NoteModal.tsx`: Add UI for tags, priority, templates, export.
- `NotesList.tsx`: Search, priority badges, pin, sort, bulk.
- Supabase hooks.

**Next Steps**:
2. ✅ Update types.ts
3. ✅ Update NoteForm (state, save, full UI: priority/tags/pin/template)
4. [ ] Update NoteModal (add pro fields)
5. [ ] Enhance NotesList (search, badges, pin, sort)
6. [ ] Supabase schema/hooks/migration
7. [ ] Test
8. ✅ Complete

