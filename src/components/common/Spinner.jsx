import { LoaderCircle } from 'lucide-react'

export default function Spinner({ label = 'Inapakia' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
      <LoaderCircle className="animate-spin text-accent" size={18} />
      {label}
    </div>
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <Spinner />
    </div>
  )
}
