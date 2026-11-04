import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import { useSettings } from '../../contexts/SettingsContext'
import { uploadFile } from '../../lib/media'
import { updateSettings } from '../../services/catalog'
import { errorText } from '../../utils/format'
import { validateImage } from '../../utils/validators'

export default function SettingsPage() {
  const { settings, refresh } = useSettings()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function onImage(key, file) {
    const problem = validateImage(file)
    if (problem) {
      toast.error(problem)
      return
    }
    try {
      const path = await uploadFile('public-assets', file, 'brand')
      set(key, path)
      toast.success('Image uploaded. Save settings to keep it.')
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  async function onSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const values = { ...form }
    delete values.id
    delete values.updated_at
    try {
      await updateSettings(values)
      await refresh()
      toast.success('Settings saved')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        title="Settings"
        text="These details appear on the public website and on printed quotations. The year and job counts are marketing text, not figures calculated from orders."
        action={<Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ['business_name', 'Business name'],
          ['tagline', 'Tagline'],
          ['phone', 'Phone'],
          ['whatsapp', 'WhatsApp number'],
          ['email', 'Email'],
          ['address', 'Workshop address'],
          ['map_url', 'Google Maps embed URL'],
          ['currency_code', 'Currency code'],
          ['facebook', 'Facebook URL'],
          ['instagram', 'Instagram URL'],
          ['stat_years', 'Homepage years'],
          ['stat_projects', 'Homepage jobs'],
          ['hero_eyebrow', 'Hero eyebrow'],
          ['hero_headline', 'Hero headline'],
          ['hero_highlight', 'Hero orange word'],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <input className={inputClass} value={form[key] || ''} onChange={(event) => set(key, event.target.value)} />
          </Field>
        ))}
        <div className="md:col-span-2">
          <Field label="Hero subtext"><textarea className={inputClass} rows={2} value={form.hero_subtext || ''} onChange={(event) => set('hero_subtext', event.target.value)} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="About"><textarea className={inputClass} rows={4} value={form.about || ''} onChange={(event) => set('about', event.target.value)} /></Field>
        </div>
        <Field label="Feature title"><input className={inputClass} value={form.feature_title || ''} onChange={(event) => set('feature_title', event.target.value)} /></Field>
        <Field label="Callout title"><input className={inputClass} value={form.callout_title || ''} onChange={(event) => set('callout_title', event.target.value)} /></Field>
        <div className="md:col-span-2">
          <Field label="Feature text"><textarea className={inputClass} rows={2} value={form.feature_text || ''} onChange={(event) => set('feature_text', event.target.value)} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Callout text"><textarea className={inputClass} rows={2} value={form.callout_text || ''} onChange={(event) => set('callout_text', event.target.value)} /></Field>
        </div>
        {['hero_image_url', 'about_image_url', 'feature_image_url'].map((key) => (
          <Field key={key} label={key.replaceAll('_', ' ')}>
            <input className={inputClass} value={form[key] || ''} onChange={(event) => set(key, event.target.value)} />
            <input className="mt-2 text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onImage(key, event.target.files?.[0])} />
          </Field>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Hours</h2>
        <div className="mt-3 space-y-2">
          {(form.hours || []).map((row, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <input className={inputClass} value={row.days} onChange={(event) => updateList('hours', index, { ...row, days: event.target.value })} />
              <input className={inputClass} value={row.hours} onChange={(event) => updateList('hours', index, { ...row, hours: event.target.value })} />
            </div>
          ))}
          <Button type="button" variant="surface" onClick={() => set('hours', [...(form.hours || []), { days: '', hours: '' }])}>Add hours</Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Why choose us</h2>
        <div className="mt-3 space-y-2">
          {(form.why_choose || []).map((row, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <input className={inputClass} value={row.title} onChange={(event) => updateList('why_choose', index, { ...row, title: event.target.value })} />
              <input className={inputClass} value={row.text} onChange={(event) => updateList('why_choose', index, { ...row, text: event.target.value })} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Testimonials</h2>
        <div className="mt-3 space-y-2">
          {(form.testimonials || []).map((row, index) => (
            <div key={index} className="grid gap-2">
              <textarea className={inputClass} rows={2} value={row.quote} onChange={(event) => updateList('testimonials', index, { ...row, quote: event.target.value })} />
              <div className="grid gap-2 md:grid-cols-2">
                <input className={inputClass} placeholder="Name" value={row.name} onChange={(event) => updateList('testimonials', index, { ...row, name: event.target.value })} />
                <input className={inputClass} placeholder="Role" value={row.role} onChange={(event) => updateList('testimonials', index, { ...row, role: event.target.value })} />
              </div>
            </div>
          ))}
          <Button type="button" variant="surface" onClick={() => set('testimonials', [...(form.testimonials || []), { quote: '', name: '', role: '' }])}>Add testimonial</Button>
        </div>
      </section>
    </form>
  )

  function updateList(key, index, value) {
    set(key, form[key].map((row, rowIndex) => (rowIndex === index ? value : row)))
  }
}
