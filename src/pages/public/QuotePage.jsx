import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSettings } from '../../contexts/SettingsContext'
import { listServices } from '../../services/catalog'
import { submitQuote } from '../../services/quotes'
import { errorText, whatsappLink } from '../../utils/format'
import { validateImage, validateQuote } from '../../utils/validators'
import { localizeService } from '../../utils/swahili'

const empty = {
  customer_name: '',
  phone: '',
  email: '',
  project_title: '',
  fabrication_type: '',
  description: '',
  dimensions: '',
  preferred_materials: '',
  quantity: '1',
  location: '',
  preferred_completion_date: '',
}

export default function QuotePage() {
  const { settings, configured } = useSettings()
  const { lang } = useLanguage()
  const [params] = useSearchParams()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [file, setFile] = useState(null)
  const [types, setTypes] = useState(['Uundaji maalum wa chuma'])
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    listServices().then((services) => {
      const names = services.map((service) => localizeService(service, lang).name)
      setTypes(names.length ? names : [lang === 'en' ? 'Custom metal fabrication' : 'Uundaji maalum wa chuma'])
    })
  }, [lang])

  useEffect(() => {
    const product = params.get('product')
    const service = params.get('service')
    setForm((current) => ({
      ...current,
      project_title: product || service || current.project_title,
      fabrication_type: service || current.fabrication_type || (product ? 'Uundaji maalum wa chuma' : ''),
      description: product ? `Oda ya ${product}.` : current.description,
    }))
  }, [params])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function showStep(nextStep) {
    if (nextStep <= step) {
      setStep(nextStep)
      return
    }
    if (nextStep !== step + 1) return
    const found = validateQuote(form)
    const fields = step === 0
      ? ['customer_name', 'phone', 'email']
      : ['project_title', 'fabrication_type', 'description', 'quantity']
    const nextErrors = {}
    fields.forEach((key) => {
      if (found[key]) nextErrors[key] = found[key]
    })
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) setStep(nextStep)
  }

  async function onSubmit(event) {
    event.preventDefault()
    const nextErrors = validateQuote(form)
    const imageError = validateImage(file)
    if (imageError) nextErrors.image = imageError
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      const response = await submitQuote(form, file)
      setResult(response)
      toast.success('Ombi la bei limetumwa')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setSaving(false)
    }
  }

  if (result) {
    const link = whatsappLink(settings.whatsapp || settings.phone, `Habari, nambari ya ombi langu ni ${result.reference_number}.`)
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Ombi limepokelewa</p>
        <h1 className="mt-3 font-display text-5xl uppercase">Tumepokea maelezo yako</h1>
        <p className="mt-4 text-muted">Hifadhi nambari hii. Karakana itaitumia wakati wa kuandaa makadirio.</p>
        <p className="mt-6 font-display text-4xl text-accent">{result.reference_number}</p>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            Tutumie ujumbe WhatsApp
          </a>
        ) : (
          <p className="mt-6 text-sm text-muted">Nambari ya WhatsApp inaweza kuongezwa kwenye mipangilio.</p>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <PageHeader
        eyebrow="Makadirio"
        title="Tuambie cha kutengeneza"
        text="Huhitaji akaunti. Tutaweka bei kabla ya chuma kukatiwa."
      />
      {!configured && (
        <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Onyesho hili haliwezi kuhifadhi ombi hadi Supabase iunganishwe.
        </p>
      )}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {['Mawasiliano', 'Kazi', 'Maelezo'].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => showStep(index)}
            className={`rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide ${step === index ? 'bg-accent text-white' : 'bg-surface text-muted'}`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-line bg-card p-5 md:grid-cols-2">
        {step === 0 && (
          <>
            <Field label="Jina lako" error={errors.customer_name}>
              <input className={inputClass} value={form.customer_name} onChange={(event) => set('customer_name', event.target.value)} />
            </Field>
            <Field label="Simu" error={errors.phone}>
              <input className={inputClass} value={form.phone} onChange={(event) => set('phone', event.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Barua pepe (si lazima)" error={errors.email}>
                <input className={inputClass} value={form.email} onChange={(event) => set('email', event.target.value)} />
              </Field>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <Field label="Jina la kazi" error={errors.project_title}>
              <input className={inputClass} value={form.project_title} onChange={(event) => set('project_title', event.target.value)} />
            </Field>
            <Field label="Aina ya kazi" error={errors.fabrication_type}>
              <select className={inputClass} value={form.fabrication_type} onChange={(event) => set('fabrication_type', event.target.value)}>
                <option value="">Chagua</option>
                {types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>
            <Field label="Idadi" error={errors.quantity}>
              <input className={inputClass} type="number" min="1" value={form.quantity} onChange={(event) => set('quantity', event.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Maelezo ya kazi" error={errors.description}>
                <textarea className={inputClass} rows={4} value={form.description} onChange={(event) => set('description', event.target.value)} />
              </Field>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Field label="Vipimo">
              <input className={inputClass} value={form.dimensions} onChange={(event) => set('dimensions', event.target.value)} />
            </Field>
            <Field label="Vifaa unavyopendelea">
              <input className={inputClass} value={form.preferred_materials} onChange={(event) => set('preferred_materials', event.target.value)} />
            </Field>
            <Field label="Mahali">
              <input className={inputClass} value={form.location} onChange={(event) => set('location', event.target.value)} />
            </Field>
            <Field label="Tarehe unayotaka kukamilika">
              <input className={inputClass} type="date" value={form.preferred_completion_date} onChange={(event) => set('preferred_completion_date', event.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Picha au mchoro" hint="JPG, PNG, au WebP. Si zaidi ya MB 5." error={errors.image}>
                <input
                  className="text-sm text-muted"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                />
                {file && <span className="mt-1 block text-xs text-muted">{file.name}</span>}
              </Field>
            </div>
          </>
        )}
        <div className="flex flex-wrap gap-2 md:col-span-2">
          {step > 0 && (
            <Button type="button" variant="surface" onClick={() => setStep((value) => value - 1)}>Rudi</Button>
          )}
          {step < 2 ? (
            <Button type="button" onClick={() => showStep(step + 1)}>Endelea</Button>
          ) : (
            <Button type="submit" disabled={saving}>{saving ? 'Inatuma…' : 'Tuma ombi'}</Button>
          )}
        </div>
      </form>
    </div>
  )
}
