import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import { useSettings } from '../../contexts/SettingsContext'
import { submitContact } from '../../services/quotes'
import { errorText, whatsappLink } from '../../utils/format'
import { validateContact } from '../../utils/validators'

export default function ContactPage() {
  const { settings, configured } = useSettings()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)
  const whatsapp = whatsappLink(settings.whatsapp || settings.phone)
  const todayIndex = new Date().getDay() === 0 ? 2 : new Date().getDay() === 6 ? 1 : 0
  const today = settings.hours?.[todayIndex]
  const openToday = today && !/closed|imefungwa/i.test(today.hours)

  async function onSubmit(event) {
    event.preventDefault()
    const nextErrors = validateContact(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      await submitContact(form)
      setSent(true)
      toast.success('Ujumbe umetumwa')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-2">
      <div>
        <PageHeader eyebrow="Wasiliana" title="Zungumza na karakana" />
        {today && (
          <p className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${openToday ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-muted'}`}>
            {openToday ? `Wazi leo · ${today.hours}` : 'Imefungwa leo'}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <ContactTile icon={Phone} label="Simu" value={settings.phone || 'Haijaongezwa'} href={settings.phone ? `tel:${settings.phone}` : undefined} />
          <ContactTile icon={MessageCircle} label="WhatsApp" value={whatsapp ? 'Tuma ujumbe karakani' : 'Haijaongezwa'} href={whatsapp || undefined} />
          <ContactTile icon={Mail} label="Barua pepe" value={settings.email || 'Haijaongezwa'} href={settings.email ? `mailto:${settings.email}` : undefined} />
          <ContactTile icon={MapPin} label="Karakana" value={settings.address || 'Mahali haijaongezwa'} />
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Saa za kazi</p>
          <ul className="mt-2 space-y-1 text-sm">
            {(settings.hours || []).map((row, index) => (
              <li key={row.days} className={`flex justify-between gap-4 rounded-md px-2 py-1.5 ${index === todayIndex ? 'bg-orange-50 text-ink' : 'text-muted'}`}>
                <span>{row.days}{index === todayIndex ? ' · leo' : ''}</span>
                <span>{row.hours}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-line bg-card">
          {settings.map_url ? (
            <iframe title="Mahali pa karakana" src={settings.map_url} className="h-64 w-full border-0" loading="lazy" />
          ) : (
            <div className="flex h-64 items-center justify-center px-6 text-center text-sm text-muted">
              Ramani itaonekana hapa baada ya kiungo cha Google Maps kuhifadhiwa kwenye mipangilio.
            </div>
          )}
        </div>
      </div>
      <form onSubmit={onSubmit} className="h-fit space-y-4 rounded-lg border border-line bg-card p-5">
        {sent ? (
          <p className="text-paper">Asante. Karakana imepokea ujumbe wako.</p>
        ) : (
          <>
            {!configured && <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">Unganisha Supabase kabla fomu hii haiwezi kuhifadhi ujumbe.</p>}
            <Field label="Jina" error={errors.name}>
              <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </Field>
            <Field label="Simu" error={errors.phone}>
              <input className={inputClass} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </Field>
            <Field label="Barua pepe (si lazima)" error={errors.email}>
              <input className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </Field>
            <Field label="Ujumbe" error={errors.message}>
              <textarea className={inputClass} rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            </Field>
            <Button type="submit" disabled={saving}>{saving ? 'Inatuma…' : 'Tuma ujumbe'}</Button>
          </>
        )}
      </form>
    </div>
  )
}

function ContactTile({ icon: Icon, label, value, href }) {
  const className = 'lift-card flex items-start gap-3 rounded-lg border border-line bg-card p-3 text-sm'
  const body = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-orange-50 text-accent"><Icon size={16} /></span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
        <span className="text-ink">{value}</span>
      </span>
    </>
  )
  if (!href) return <div className={className}>{body}</div>
  return (
    <a className={className} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {body}
    </a>
  )
}
