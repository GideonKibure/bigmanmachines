import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
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
  if (type === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.61-2.89-1.25-4.77-4.16-4.91-4.35-.14-.2-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.56.16.28.7 1.16 1.51 1.88 1.04.92 1.91 1.21 2.19 1.35.28.14.44.12.6-.07.17-.2.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
      </svg>
    )
  }
  if (type === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M14.5 3c.4 2.4 1.8 4.1 4.1 4.4v2.4c-1.4 0-2.7-.4-4-1.2v6.7a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v2.6a3.2 3.2 0 1 0 2.3 3.1V3h2.5z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" />
    </svg>
  )
}

function SocialLink({ type, label, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-zinc-200 transition hover:-translate-y-0.5 hover:border-accent hover:text-white">
      <SocialIcon type={type} />
      {label}
    </a>
  )
}

export default function Footer() {
  const { settings } = useSettings()
  const { lang } = useLanguage()
  const text = lang === 'en'
    ? { services: 'Services', all: 'All services', work: 'Completed work', products: 'Ready-made products', quote: 'Request a quote', contact: 'Contact', phone: 'Add a phone number in settings.', social: 'Social' }
    : { services: 'Huduma', all: 'Huduma zote', work: 'Kazi zilizokamilika', products: 'Bidhaa tayari', quote: 'Omba bei', contact: 'Mawasiliano', phone: 'Ongeza nambari ya simu kwenye mipangilio.', social: 'Mitandao' }
  const visible = settings.social_visible || {}
  const show = (key) => visible[key] !== false
  const whatsapp = whatsappLink(settings.whatsapp || settings.phone)
  const socials = [
    show('whatsapp') && whatsapp ? { type: 'whatsapp', label: 'WhatsApp', href: whatsapp } : null,
    show('facebook') && settings.facebook ? { type: 'facebook', label: 'Facebook', href: settings.facebook } : null,
    show('instagram') && settings.instagram ? { type: 'instagram', label: 'Instagram', href: settings.instagram } : null,
    show('tiktok') && settings.tiktok ? { type: 'tiktok', label: 'TikTok', href: settings.tiktok } : null,
  ].filter(Boolean)

  return (
    <footer className="bg-ink text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl uppercase text-white">{settings.business_name}</p>
          <p className="mt-3 text-sm text-zinc-400">{settings.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{text.services}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/services" className="hover:text-white">{text.all}</Link>
            <Link to="/projects" className="hover:text-white">{text.work}</Link>
            <Link to="/products" className="hover:text-white">{text.products}</Link>
            <Link to="/quote" className="hover:text-white">{text.quote}</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{text.contact}</p>
          <div className="mt-3 space-y-2 text-sm">
            {settings.phone ? (
              <a className="flex items-center gap-2 hover:text-white" href={`tel:${settings.phone}`}>
                <Phone size={15} /> {settings.phone}
              </a>
            ) : (
              <p className="text-zinc-400">{text.phone}</p>
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
          {socials.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{text.social}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((item) => (
                  <SocialLink key={item.type} type={item.type} label={item.label} href={item.href} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-zinc-500">
        © {year} {settings.business_name}
      </div>
    </footer>
  )
}
