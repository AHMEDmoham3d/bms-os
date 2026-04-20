import NotesReportTable from './NotesReportTable';

export default function NotesList(props: Parameters<typeof NotesReportTable>[0]) {
  return <NotesReportTable {...props} />;
}

