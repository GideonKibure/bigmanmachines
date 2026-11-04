export const inputClass =
  'w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-zinc-400 focus:border-accent'

export default function Field({ label, hint, error, children }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-paper">{label}</span>}
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      {error && <span className="block text-xs text-red-700">{error}</span>}
    </label>
  )
}
