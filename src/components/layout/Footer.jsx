import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'
import { whatsappLink } from '../../utils/format'

const year = new Date().getFullYear()

function SocialIcon({ type }) {
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" />
    </svg>
  )
}

export default function Footer() {
  const { settings } = useSettings()
  const whatsapp = whatsappLink(settings.whatsapp || settings.phone)

  return (
    <footer className="bg-ink text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl uppercase text-white">{settings.business_name}</p>
          <p className="mt-3 text-sm text-zinc-400">{settings.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Services</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/services" className="hover:text-white">All services</Link>
            <Link to="/projects" className="hover:text-white">Completed work</Link>
            <Link to="/products" className="hover:text-white">Ready-made products</Link>
            <Link to="/quote" className="hover:text-white">Request a quote</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Contact</p>
          <div className="mt-3 space-y-2 text-sm">
            {settings.phone ? (
              <a className="flex items-center gap-2 hover:text-white" href={`tel:${settings.phone}`}>
                <Phone size={15} /> {settings.phone}
              </a>
            ) : (
              <p className="text-zinc-400">Add a phone number in settings.</p>
            )}
            {whatsapp && (
              <a className="flex items-center gap-2 hover:text-white" href={whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
            {settings.email && (
              <a className="flex items-center gap-2 hover:text-white" href={`mailto:${settings.email}`}>
                <Mail size={15} /> {settings.email}
              </a>
            )}
            {settings.address && (
              <p className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5" /> {settings.address}
              </p>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-zinc-400 hover:text-white">
                <SocialIcon type="facebook" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-zinc-400 hover:text-white">
                <SocialIcon type="instagram" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-zinc-500">
        © {year} {settings.business_name}
      </div>
    </footer>
  )
}
