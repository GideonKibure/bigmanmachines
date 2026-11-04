export default function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-4xl uppercase leading-none text-paper md:text-5xl">{title}</h2>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  )
}
