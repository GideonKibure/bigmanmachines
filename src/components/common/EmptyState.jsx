export default function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-card px-5 py-10 text-center">
      <h2 className="font-display text-2xl uppercase text-paper">{title}</h2>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-muted">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
