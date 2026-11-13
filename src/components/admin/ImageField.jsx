import { useState } from 'react'
import toast from 'react-hot-toast'
import Field, { inputClass } from '../common/Field'
import { mediaUrl, uploadFile } from '../../lib/media'
import { errorText } from '../../utils/format'
import { validateImage } from '../../utils/validators'

export default function ImageField({ label, value, onChange, folder = 'website' }) {
  const [busy, setBusy] = useState(false)

  async function onFile(file) {
    if (!file) return
    const problem = validateImage(file)
    if (problem) {
      toast.error(problem)
      return
    }
    setBusy(true)
    try {
      const path = await uploadFile('public-assets', file, folder)
      onChange(path)
      toast.success('Picha imepakiwa. Hifadhi ili ibaki kwenye tovuti.')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Field label={label}>
      {value ? (
        <img src={mediaUrl(value)} alt="" className="mb-2 h-40 w-full rounded-md object-cover" />
      ) : (
        <div className="mb-2 grid h-40 place-items-center rounded-md border border-dashed border-line text-sm text-muted">Hakuna picha</div>
      )}
      <label className="inline-flex cursor-pointer rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
        {busy ? 'Inapakia…' : value ? 'Badilisha picha' : 'Pakia picha'}
        <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => onFile(event.target.files?.[0])} />
      </label>
      {value && (
        <button type="button" className="ml-2 text-sm text-muted hover:text-ink" onClick={() => onChange('')}>
          Ondoa
        </button>
      )}
      <input className={`${inputClass} mt-2`} placeholder="Au bandika kiungo cha picha" value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </Field>
  )
}

export function GalleryField({ photos, onChange, folder = 'portfolio' }) {
  const [busy, setBusy] = useState(false)

  async function addFiles(list) {
    const files = [...(list || [])]
    if (!files.length) return
    setBusy(true)
    const next = [...photos]
    try {
      for (const file of files) {
        const problem = validateImage(file)
        if (problem) {
          toast.error(problem)
          continue
        }
        next.push(await uploadFile('public-assets', file, folder))
      }
      onChange(next)
      toast.success('Picha zimepakiwa. Hifadhi ili zibaki.')
    } catch (error) {
      toast.error(errorText(error))
      onChange(next)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-paper">Picha</p>
      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="relative">
            <img src={mediaUrl(photo)} alt="" className="h-28 w-full rounded-md object-cover" />
            <div className="mt-1 flex gap-2 text-xs">
              {index === 0 ? <span className="text-accent">Kava</span> : (
                <button type="button" className="text-accent" onClick={() => onChange([photo, ...photos.filter((_, item) => item !== index)])}>Weka kama kava</button>
              )}
              <button type="button" className="text-muted" onClick={() => onChange(photos.filter((_, item) => item !== index))}>Ondoa</button>
            </div>
          </div>
        ))}
      </div>
      {!photos.length && <div className="mb-2 grid h-28 place-items-center rounded-md border border-dashed border-line text-sm text-muted">Hakuna picha</div>}
      <label className="mt-2 inline-flex cursor-pointer rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-dark">
        {busy ? 'Inapakia…' : 'Pakia picha'}
        <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event) => addFiles(event.target.files)} />
      </label>
      <p className="mt-1 text-xs text-muted">Picha ya kwanza ndiyo inayoonekana kwenye orodha. JPG, PNG, au WebP. Si zaidi ya MB 5.</p>
    </div>
  )
}
