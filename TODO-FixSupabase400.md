# Fix Supabase 400 Error on Notes Insert/Fetch

Status: 🔄 In Progress

## Diagnosis
- Categories fetch OK (8 real records)
- Notes fetch 400 → mock fallback 
- Inserts fail silently ("Save failed")
- Likely: schema mismatch (tags[], priority enum, pinned bool) or RLS blocking anon

## Steps
- [x] 1. Create this TODO
- [x] 2. Add detailed error logging to NoteForm handleSubmit & useNotesData
- [x] 3. Simplify NoteForm payload (title, content, category_id, image?, video_url?)
- [x] 4. Test insert → logging added (user to test)
- [ ] 5. Test fetch without mock fallback
- [x] 6. Fixed varchar(255) limit - truncated title/content/image/video_url
- [ ] 7. Dashboard: increase column limits if needed (title text, content text)
- [ ] 6. Fix schema/RLS based on error
- [ ] 7. Test full CRUD + fetch (disable mock conditionally)
- [ ] 8. Reintroduce fields (tags as text[], etc.)
- [ ] 9. Update types/NoteForm to match fixed schema
- [ ] 10. Complete ✅

## Testing
Run app, create note, check browser console + Network tab for exact 400 response.

