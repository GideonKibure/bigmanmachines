import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import Modal from '../../components/common/Modal'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useLoad } from '../../hooks/useLoad'
import { uploadFile } from '../../lib/media'
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
import { validateImage } from '../../utils/validators'

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CatalogPage() {
  const [tab, setTab] = useState('services')
  const [tick, setTick] = useState(0)
  const [form, setForm] = useState(null)
  const services = useLoad(() => listServices({ includeHidden: true }), [tick])
  const products = useLoad(() => listProducts({ includeHidden: true }), [tick])
  const projects = useLoad(() => listPortfolio({ includeHidden: true }), [tick])
  const loading = services.loading || products.loading || projects.loading

  async function onUpload(file) {
    const problem = validateImage(file)
    if (problem) {
      toast.error(problem)
      return
    }
    try {
      const path = await uploadFile('public-assets', file, tab)
      setForm((current) => ({ ...current, image_url: path, cover_image_url: path }))
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  async function onSave(event) {
    event.preventDefault()
    try {
      if (tab === 'services') {
        await saveService({
          ...form,
          slug: form.slug || slugify(form.name),
          highlights: String(form.highlightsText || '').split('\n').map((line) => line.trim()).filter(Boolean),
        })
      } else if (tab === 'products') {
        const specifications = {}
        String(form.specificationsText || '').split('\n').forEach((line) => {
          const [key, ...rest] = line.split(':')
          if (key && rest.length) specifications[key.trim()] = rest.join(':').trim()
        })
        await saveProduct({ ...form, slug: form.slug || slugify(form.name), specifications })
      } else {
        await savePortfolioProject({
          ...form,
          images: form.cover_image_url ? [{ image_url: form.cover_image_url }] : [],
        })
      }
      toast.success('Saved')
      setForm(null)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  const rows = tab === 'services' ? services.data : tab === 'products' ? products.data : projects.data

  return (
    <div>
      <PageHeader title="Website content" text="Services, products, and portfolio photos shown to customers." action={<Button type="button" onClick={() => setForm(blankFor(tab))}>Add</Button>} />
      <div className="mb-4 flex gap-2">
        {['services', 'products', 'portfolio'].map((item) => (
          <Button key={item} type="button" variant={tab === item ? 'primary' : 'surface'} onClick={() => setTab(item)}>{item}</Button>
        ))}
      </div>
      {loading && <Spinner />}
      <div className="space-y-2">
        {(rows || []).map((row) => (
          <article key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-card px-3 py-3">
            <div>
              <p className="font-medium">{row.name || row.title}</p>
              <p className="text-xs text-muted">{row.is_active === false || row.is_published === false ? 'Hidden' : 'Visible'}</p>
            </div>
            <span className="flex gap-2">
              <button type="button" className="text-sm text-accent" onClick={() => setForm(toForm(tab, row))}>Edit</button>
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
                {row.is_active === false || row.is_published === false ? 'Show' : 'Hide'}
              </button>
            </span>
          </article>
        ))}
      </div>
      <Modal open={Boolean(form)} title="Edit content" onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={onSave} className="grid gap-3">
            <Field label="Name"><input className={inputClass} required value={form.name || form.title || ''} onChange={(event) => setForm(tab === 'portfolio' ? { ...form, title: event.target.value } : { ...form, name: event.target.value })} /></Field>
            <Field label="Category"><input className={inputClass} value={form.category || ''} onChange={(event) => setForm({ ...form, category: event.target.value })} /></Field>
            <Field label="Description"><textarea className={inputClass} rows={3} value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
            {tab === 'services' && (
              <Field label="Summary"><input className={inputClass} value={form.summary || ''} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></Field>
            )}
            {tab === 'services' && (
              <Field label="Highlights, one per line"><textarea className={inputClass} rows={3} value={form.highlightsText || ''} onChange={(event) => setForm({ ...form, highlightsText: event.target.value })} /></Field>
            )}
            {tab === 'products' && (
              <>
                <Field label="Price"><input className={inputClass} type="number" min="0" value={form.price ?? ''} onChange={(event) => setForm({ ...form, price: event.target.value })} /></Field>
                <Field label="Availability">
                  <select className={inputClass} value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })}>
                    {AVAILABILITY.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </Field>
                <Field label="Specifications, one per line as Label: value"><textarea className={inputClass} rows={3} value={form.specificationsText || ''} onChange={(event) => setForm({ ...form, specificationsText: event.target.value })} /></Field>
              </>
            )}
            {tab === 'portfolio' && (
              <>
                <Field label="Completion date"><input className={inputClass} type="date" value={form.completion_date || ''} onChange={(event) => setForm({ ...form, completion_date: event.target.value })} /></Field>
                <Field label="Materials"><input className={inputClass} value={form.materials || ''} onChange={(event) => setForm({ ...form, materials: event.target.value })} /></Field>
              </>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(form.is_featured)} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} />
              Featured on the homepage
            </label>
            <Field label="Image">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onUpload(event.target.files?.[0])} />
            </Field>
            <Button type="submit">Save</Button>
          </form>
        )}
      </Modal>
    </div>
  )
}

function blankFor(tab) {
  if (tab === 'products') return { name: '', description: '', price: '', availability: 'made_to_order', specificationsText: '', is_featured: false, is_active: true }
  if (tab === 'portfolio') return { title: '', category: 'Custom', description: '', materials: '', completion_date: '', is_featured: false, is_published: true }
  return { name: '', category: 'Custom', summary: '', description: '', highlightsText: '', is_featured: false, is_active: true, sort_order: 0 }
}

function toForm(tab, row) {
  if (tab === 'services') return { ...row, highlightsText: (row.highlights || []).join('\n') }
  if (tab === 'products') {
    return {
      ...row,
      specificationsText: Object.entries(row.specifications || {}).map(([key, value]) => `${key}: ${value}`).join('\n'),
    }
  }
  return row
}
