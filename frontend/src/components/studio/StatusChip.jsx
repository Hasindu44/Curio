export default function StatusChip({ published }) {
  return <span className={`status-chip ${published ? "is-published" : "is-draft"}`}>
    <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true"/>
    {published ? "Published" : "Draft"}
  </span>;
}
