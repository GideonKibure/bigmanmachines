import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ImageField from '../../components/admin/ImageField'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import { useSettings } from '../../contexts/SettingsContext'
import { updateSettings } from '../../services/catalog'
import { errorText } from '../../utils/format'
import { splitSettings } from '../../utils/swahili'

const SHARED = [
  ['business_name', 'Jina la biashara'],
  ['phone', 'Simu'],
  ['email', 'Barua pepe'],
  ['address', 'Anwani ya karakana'],
  ['map_url', 'Kiungo cha ramani ya Google'],
  ['currency_code', 'Msimbo wa sarafu'],
  ['stat_years', 'Miaka kwenye ukurasa wa mwanzo'],
  ['stat_projects', 'Kazi kwenye ukurasa wa mwanzo'],
]

function draftFrom(raw) {
  const { swahili, english } = splitSettings(raw)
  const shared = {}
  SHARED.forEach(([key]) => {
    shared[key] = raw[key] || ''
  })
  shared.whatsapp = raw.whatsapp || ''
  shared.facebook = raw.facebook || ''
  shared.instagram = raw.instagram || ''
  shared.tiktok = raw.tiktok || ''
  shared.social_visible = {
    whatsapp: true,
    facebook: true,
    instagram: true,
    tiktok: true,
    ...(raw.social_visible || {}),
  }
  shared.hero_image_url = raw.hero_image_url || ''
  shared.about_image_url = raw.about_image_url || ''
  shared.feature_image_url = raw.feature_image_url || ''
  return { shared, sw: swahili, en: english }
}

export default function SettingsPage() {
  const { raw, refresh } = useSettings()
  const [draft, setDraft] = useState(() => draftFrom(raw))
  const [lang, setLang] = useState('sw')
  const [saving, setSaving] = useState(false)
  const copy = draft[lang]

  useEffect(() => {
    setDraft(draftFrom(raw))
  }, [raw])

  function setShared(key, value) {
    setDraft((current) => ({ ...current, shared: { ...current.shared, [key]: value } }))
  }

  function setVisible(key, value) {
    setDraft((current) => ({
      ...current,
      shared: {
        ...current.shared,
        social_visible: { ...current.shared.social_visible, [key]: value },
      },
    }))
  }

  function setCopy(key, value) {
    setDraft((current) => ({ ...current, [lang]: { ...current[lang], [key]: value } }))
  }

  function updateList(key, index, value) {
    setCopy(key, copy[key].map((row, rowIndex) => (rowIndex === index ? value : row)))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await updateSettings({
        ...draft.shared,
        ...draft.sw,
        english: draft.en,
      })
      await refresh()
      toast.success('Mipangilio imehifadhiwa')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        title="Mipangilio"
        text="Andika maandishi kwa Kiswahili na Kiingereza. Picha zinapakiwa kutoka kompyuta yako, na bado unaweza kubandika kiungo."
        action={<Button type="submit" disabled={saving}>{saving ? 'Inahifadhi…' : 'Hifadhi mipangilio'}</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {SHARED.map(([key, label]) => (
          <Field key={key} label={label}>
            <input className={inputClass} value={draft.shared[key] || ''} onChange={(event) => setShared(key, event.target.value)} />
          </Field>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Mitandao</h2>
        <p className="mt-1 text-sm text-muted">Washa swichi ili akaunti ionekane kwenye tovuti. Ikiwa imezimwa, wageni hawaioni.</p>
        <div className="mt-3 grid gap-3">
          {[
            ['whatsapp', 'WhatsApp', 'Nambari ya WhatsApp'],
            ['facebook', 'Facebook', 'Kiungo cha Facebook'],
            ['instagram', 'Instagram', 'Kiungo cha Instagram'],
            ['tiktok', 'TikTok', 'Kiungo cha TikTok'],
          ].map(([key, name, label]) => (
            <div key={key} className="grid items-end gap-3 rounded-md border border-line p-3 md:grid-cols-[auto_1fr]">
              <label className="flex items-center gap-2 pb-2 text-sm font-medium">
                <input type="checkbox" checked={draft.shared.social_visible?.[key] !== false} onChange={(event) => setVisible(key, event.target.checked)} />
                Onyesha {name}
              </label>
              <Field label={label}>
                <input className={inputClass} value={draft.shared[key] || ''} onChange={(event) => setShared(key, event.target.value)} />
              </Field>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ImageField label="Picha ya mwanzo" folder="brand" value={draft.shared.hero_image_url} onChange={(value) => setShared('hero_image_url', value)} />
        <ImageField label="Picha ya kuhusu" folder="brand" value={draft.shared.about_image_url} onChange={(value) => setShared('about_image_url', value)} />
        <ImageField label="Picha ya kipengele" folder="brand" value={draft.shared.feature_image_url} onChange={(value) => setShared('feature_image_url', value)} />
      </div>

      <div className="mt-8 flex gap-2">
        <Button type="button" variant={lang === 'sw' ? 'primary' : 'surface'} onClick={() => setLang('sw')}>Kiswahili</Button>
        <Button type="button" variant={lang === 'en' ? 'primary' : 'surface'} onClick={() => setLang('en')}>English</Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          ['tagline', 'Kauli'],
          ['hero_eyebrow', 'Kichwa kidogo cha mwanzo'],
          ['hero_headline', 'Kichwa kikuu cha mwanzo'],
          ['hero_highlight', 'Neno la machungwa'],
          ['feature_title', 'Kichwa cha kipengele'],
          ['callout_title', 'Kichwa cha wito'],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <input className={inputClass} value={copy[key] || ''} onChange={(event) => setCopy(key, event.target.value)} />
          </Field>
        ))}
        <div className="md:col-span-2">
          <Field label="Maelezo ya mwanzo"><textarea className={inputClass} rows={2} value={copy.hero_subtext || ''} onChange={(event) => setCopy('hero_subtext', event.target.value)} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Kuhusu"><textarea className={inputClass} rows={4} value={copy.about || ''} onChange={(event) => setCopy('about', event.target.value)} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Maelezo ya kipengele"><textarea className={inputClass} rows={2} value={copy.feature_text || ''} onChange={(event) => setCopy('feature_text', event.target.value)} /></Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Maelezo ya wito"><textarea className={inputClass} rows={2} value={copy.callout_text || ''} onChange={(event) => setCopy('callout_text', event.target.value)} /></Field>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Saa za kazi</h2>
        <div className="mt-3 space-y-2">
          {(copy.hours || []).map((row, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <input className={inputClass} value={row.days} onChange={(event) => updateList('hours', index, { ...row, days: event.target.value })} />
              <input className={inputClass} value={row.hours} onChange={(event) => updateList('hours', index, { ...row, hours: event.target.value })} />
            </div>
          ))}
          <Button type="button" variant="surface" onClick={() => setCopy('hours', [...(copy.hours || []), { days: '', hours: '' }])}>Ongeza saa</Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Kwa nini utuchague</h2>
        <div className="mt-3 space-y-2">
          {(copy.why_choose || []).map((row, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <input className={inputClass} value={row.title} onChange={(event) => updateList('why_choose', index, { ...row, title: event.target.value })} />
              <input className={inputClass} value={row.text} onChange={(event) => updateList('why_choose', index, { ...row, text: event.target.value })} />
            </div>
          ))}
          <Button type="button" variant="surface" onClick={() => setCopy('why_choose', [...(copy.why_choose || []), { title: '', text: '' }])}>Ongeza sababu</Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Ushuhuda</h2>
        <div className="mt-3 space-y-2">
          {(copy.testimonials || []).map((row, index) => (
            <div key={index} className="grid gap-2">
              <textarea className={inputClass} rows={2} value={row.quote} onChange={(event) => updateList('testimonials', index, { ...row, quote: event.target.value })} />
              <div className="grid gap-2 md:grid-cols-2">
                <input className={inputClass} placeholder="Jina" value={row.name} onChange={(event) => updateList('testimonials', index, { ...row, name: event.target.value })} />
                <input className={inputClass} placeholder="Cheo" value={row.role} onChange={(event) => updateList('testimonials', index, { ...row, role: event.target.value })} />
              </div>
            </div>
          ))}
          <Button type="button" variant="surface" onClick={() => setCopy('testimonials', [...(copy.testimonials || []), { quote: '', name: '', role: '' }])}>Ongeza ushuhuda</Button>
        </div>
      </section>
    </form>
  )
}
