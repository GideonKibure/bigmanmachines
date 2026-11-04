export default function PageHeader({ eyebrow, title, text, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
        <h1 className="font-display text-4xl uppercase leading-none text-paper">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-sm text-muted">{text}</p>}
      </div>
      {action}
    </div>
  )
}
