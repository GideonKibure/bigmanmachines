import { Link } from 'react-router-dom'
import { buttonClass } from '../../components/common/Button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-3 font-display text-5xl uppercase">Ukurasa haupo</h1>
      <Link to="/" className={`${buttonClass('primary')} mt-6`}>Rudi kwenye karakana</Link>
    </div>
  )
}
