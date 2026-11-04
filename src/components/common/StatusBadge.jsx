import { labelOf, statusTone } from '../../utils/labels'

const tones = {
  orange: 'bg-orange-100 text-orange-800',
  green: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-slate-200 text-steel',
  muted: 'bg-zinc-100 text-muted',
}

export default function StatusBadge({ status, list }) {
  const tone = tones[statusTone(status)] || tones.muted
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{labelOf(list, status)}</span>
}
