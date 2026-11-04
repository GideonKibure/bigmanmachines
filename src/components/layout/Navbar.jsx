import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { buttonClass } from '../common/Button'
import { useSettings } from '../../contexts/SettingsContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mark = (settings.business_name || 'M').trim().charAt(0).toUpperCase()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-sm font-bold text-white transition hover:rotate-6">{mark}</span>
          <span className="truncate font-display text-base uppercase tracking-wide text-ink sm:text-lg">{settings.business_name}</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link text-[13px] font-semibold uppercase tracking-[0.14em] ${isActive ? 'text-accent' : 'text-steel hover:text-ink'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Link to="/quote" className={buttonClass('primary')}>
            Get a quote
          </Link>
        </div>
        <button type="button" className="text-ink lg:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div inert={!open} className={`grid transition-[grid-template-rows] duration-300 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 border-t border-line bg-white px-5 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `text-sm font-semibold uppercase tracking-wide ${isActive ? 'text-accent' : 'text-ink'}`}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/quote" onClick={() => setOpen(false)} className={buttonClass('primary', 'mt-2')}>
              Get a quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
