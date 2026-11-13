import { useState } from 'react'
import toast from 'react-hot-toast'
import ImageField, { GalleryField } from '../../components/admin/ImageField'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import Modal from '../../components/common/Modal'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { mediaUrl } from '../../lib/media'
import { useLoad } from '../../hooks/useLoad'
import {
  listPortfolio,
  listProducts,
  listServices,
  savePortfolioProject,
  saveProduct,
  saveService,
  setPortfolioPublished,
  setProductActive,
  setServiceActive,
} from '../../services/catalog'
import { errorText } from '../../utils/format'
import { AVAILABILITY } from '../../utils/labels'
import { splitProduct, splitProject, splitService } from '../../utils/swahili'

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function linesToSpecs(text) {
  const specifications = {}
  String(text || '').split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) specifications[key.trim()] = rest.join(':').trim()
  })
  return specifications
}

function specsToLines(specifications) {
  return Object.entries(specifications || {}).map(([key, value]) => `${key}: ${value}`).join('\n')
}

function photosOf(row) {
  const urls = [row.cover_image_url || row.image_url, ...(row.images || []).map((image) => image.image_url)]
  return [...new Set(urls.filter(Boolean))]
}

export default function CatalogPage() {
  const [tab, setTab] = useState('services')
  const [tick, setTick] = useState(0)
  const [form, setForm] = useState(null)
  const [lang, setLang] = useState('sw')
  const services = useLoad(() => listServices({ includeHidden: true }), [tick])
  const products = useLoad(() => listProducts({ includeHidden: true }), [tick])
  const projects = useLoad(() => listPortfolio({ includeHidden: true }), [tick])
  const loading = services.loading || products.loading || projects.loading
  const rows = tab === 'services' ? services.data : tab === 'products' ? products.data : projects.data
  const copy = form?.[lang]

  function setCopy(patch) {
    setForm((current) => ({ ...current, [lang]: { ...current[lang], ...patch } }))
  }

  async function onSave(event) {
    event.preventDefault()
    try {
      if (tab === 'services') {
        await saveService({
          id: form.id,
          slug: form.slug || slugify(form.sw.name),
          image_url: form.image_url,
          is_featured: form.is_featured,
          is_active: form.is_active,
          sort_order: form.sort_order,
          ...form.sw,
          highlights: String(form.sw.highlightsText || '').split('\n').map((line) => line.trim()).filter(Boolean),
          english: {
            name: form.en.name,
            category: form.en.category,
            summary: form.en.summary,
            description: form.en.description,
            highlights: String(form.en.highlightsText || '').split('\n').map((line) => line.trim()).filter(Boolean),
          },
        })
      } else if (tab === 'products') {
        await saveProduct({
          id: form.id,
          slug: form.slug || slugify(form.sw.name),
          image_url: form.image_url,
          price: form.price,
          availability: form.availability,
          is_featured: form.is_featured,
          is_active: form.is_active,
          name: form.sw.name,
          description: form.sw.description,
          specifications: linesToSpecs(form.sw.specificationsText),
          english: {
            name: form.en.name,
            description: form.en.description,
            specifications: linesToSpecs(form.en.specificationsText),
          },
        })
      } else {
        await savePortfolioProject({
          id: form.id,
          cover_image_url: form.photos[0] || '',
          is_featured: form.is_featured,
          is_published: form.is_published,
          completion_date: form.completion_date,
          title: form.sw.title,
          category: form.sw.category,
          description: form.sw.description,
          materials: form.sw.materials,
          images: form.photos.map((image_url) => ({ image_url })),
          english: form.en,
        })
      }
      toast.success('Imehifadhiwa')
      setForm(null)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  return (
    <div>
      <PageHeader
        title="Maudhui ya tovuti"
        text="Hariri maandishi kwa Kiswahili na Kiingereza. Pakia picha, badilisha, au ondoa."
        action={<Button type="button" onClick={() => { setLang('sw'); setForm(blankFor(tab)) }}>Ongeza</Button>}
      />
      <div className="mb-4 flex gap-2">
        {[
          ['services', 'Huduma'],
          ['products', 'Bidhaa'],
          ['portfolio', 'Kazi'],
        ].map(([item, label]) => (
          <Button key={item} type="button" variant={tab === item ? 'primary' : 'surface'} onClick={() => setTab(item)}>{label}</Button>
        ))}
      </div>
      {loading && <Spinner />}
      <div className="space-y-2">
        {(rows || []).map((row) => {
          const label = tab === 'portfolio' ? splitProject(row).swahili.title : tab === 'products' ? splitProduct(row).swahili.name : splitService(row).swahili.name
          const photo = row.cover_image_url || row.image_url
          return (
            <article key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-card px-3 py-3">
              <div className="flex items-center gap-3">
                {photo ? <img src={mediaUrl(photo)} alt="" className="h-14 w-20 rounded-md object-cover" /> : <div className="grid h-14 w-20 place-items-center rounded-md bg-surface text-xs text-muted">Picha</div>}
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted">{row.is_active === false || row.is_published === false ? 'Imefichwa' : 'Inaonekana'}</p>
                </div>
              </div>
              <span className="flex gap-2">
                <button type="button" className="text-sm text-accent" onClick={() => { setLang('sw'); setForm(toForm(tab, row)) }}>Hariri</button>
                <button
                  type="button"
                  className="text-sm text-muted"
                  onClick={async () => {
                    try {
                      if (tab === 'services') await setServiceActive(row.id, row.is_active === false)
                      else if (tab === 'products') await setProductActive(row.id, row.is_active === false)
                      else await setPortfolioPublished(row.id, row.is_published === false)
                      setTick((value) => value + 1)
                    } catch (error) {
                      toast.error(errorText(error))
                    }
                  }}
                >
                  {row.is_active === false || row.is_published === false ? 'Onyesha' : 'Ficha'}
                </button>
              </span>
            </article>
          )
        })}
      </div>
      <Modal open={Boolean(form)} title="Hariri maudhui" className="max-w-3xl" onClose={() => setForm(null)}>
        {form && copy && (
          <form onSubmit={onSave} className="grid gap-3">
            <div className="flex gap-2">
              <Button type="button" variant={lang === 'sw' ? 'primary' : 'surface'} onClick={() => setLang('sw')}>Kiswahili</Button>
              <Button type="button" variant={lang === 'en' ? 'primary' : 'surface'} onClick={() => setLang('en')}>English</Button>
            </div>
            {tab === 'portfolio' ? (
              <Field label="Jina"><input className={inputClass} required={lang === 'sw'} value={copy.title || ''} onChange={(event) => setCopy({ title: event.target.value })} /></Field>
            ) : (
              <Field label="Jina"><input className={inputClass} required={lang === 'sw'} value={copy.name || ''} onChange={(event) => setCopy({ name: event.target.value })} /></Field>
            )}
            {tab !== 'products' && (
              <Field label="Kundi"><input className={inputClass} value={copy.category || ''} onChange={(event) => setCopy({ category: event.target.value })} /></Field>
            )}
            <Field label="Maelezo"><textarea className={inputClass} rows={3} value={copy.description || ''} onChange={(event) => setCopy({ description: event.target.value })} /></Field>
            {tab === 'services' && (
              <>
                <Field label="Muhtasari"><input className={inputClass} value={copy.summary || ''} onChange={(event) => setCopy({ summary: event.target.value })} /></Field>
                <Field label="Vidokezo, kimoja kwa kila mstari"><textarea className={inputClass} rows={3} value={copy.highlightsText || ''} onChange={(event) => setCopy({ highlightsText: event.target.value })} /></Field>
              </>
            )}
            {tab === 'products' && (
              <>
                <Field label="Bei"><input className={inputClass} type="number" min="0" value={form.price ?? ''} onChange={(event) => setForm({ ...form, price: event.target.value })} /></Field>
                <Field label="Upatikanaji">
                  <select className={inputClass} value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })}>
                    {AVAILABILITY.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </Field>
                <Field label="Vipimo, kimoja kwa kila mstari kama Jina: thamani"><textarea className={inputClass} rows={3} value={copy.specificationsText || ''} onChange={(event) => setCopy({ specificationsText: event.target.value })} /></Field>
              </>
            )}
            {tab === 'portfolio' && (
              <>
                <Field label="Tarehe ya kukamilika"><input className={inputClass} type="date" value={form.completion_date || ''} onChange={(event) => setForm({ ...form, completion_date: event.target.value })} /></Field>
                <Field label="Vifaa"><input className={inputClass} value={copy.materials || ''} onChange={(event) => setCopy({ materials: event.target.value })} /></Field>
              </>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(form.is_featured)} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} />
              Ionyeshwe kwenye ukurasa wa mwanzo
            </label>
            {tab === 'portfolio' ? (
              <GalleryField photos={form.photos} onChange={(photos) => setForm({ ...form, photos })} />
            ) : (
              <ImageField label="Picha" folder={tab} value={form.image_url} onChange={(image_url) => setForm({ ...form, image_url })} />
            )}
            <Button type="submit">Hifadhi</Button>
          </form>
        )}
      </Modal>
    </div>
  )
}

function textCopy(source, kind) {
  if (kind === 'portfolio') {
    return { title: source.title || '', category: source.category || '', description: source.description || '', materials: source.materials || '' }
  }
  if (kind === 'products') {
    return { name: source.name || '', description: source.description || '', specificationsText: specsToLines(source.specifications) }
  }
  return {
    name: source.name || '',
    category: source.category || '',
    summary: source.summary || '',
    description: source.description || '',
    highlightsText: (source.highlights || []).join('\n'),
  }
}

function blankFor(tab) {
  const empty = textCopy({}, tab === 'portfolio' ? 'portfolio' : tab === 'products' ? 'products' : 'services')
  if (tab === 'products') {
    return { price: '', availability: 'made_to_order', image_url: '', is_featured: false, is_active: true, sw: { ...empty }, en: { ...empty } }
  }
  if (tab === 'portfolio') {
    return { category: 'Maalum', completion_date: '', photos: [], is_featured: false, is_published: true, sw: { ...empty, category: 'Maalum' }, en: { ...empty, category: 'Custom' } }
  }
  return { image_url: '', is_featured: false, is_active: true, sort_order: 0, sw: { ...empty, category: 'Maalum' }, en: { ...empty, category: 'Custom' } }
}

function toForm(tab, row) {
  if (tab === 'services') {
    const parts = splitService(row)
    return { ...row, image_url: row.image_url || '', sw: textCopy(parts.swahili, 'services'), en: textCopy(parts.english, 'services') }
  }
  if (tab === 'products') {
    const parts = splitProduct(row)
    return { ...row, image_url: row.image_url || '', sw: textCopy(parts.swahili, 'products'), en: textCopy(parts.english, 'products') }
  }
  const parts = splitProject(row)
  return { ...row, photos: photosOf(row), completion_date: row.completion_date || '', sw: textCopy(parts.swahili, 'portfolio'), en: textCopy(parts.english, 'portfolio') }
}
