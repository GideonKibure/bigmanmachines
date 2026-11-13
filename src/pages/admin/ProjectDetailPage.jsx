import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useSettings } from '../../contexts/SettingsContext'
import { signedUrl, uploadFile } from '../../lib/media'
import { listMaterials, moveStock } from '../../services/inventory'
import { listEmployees } from '../../services/finance'
import {
  addProjectImage,
  getProject,
  listProjectMaterials,
  setStage,
  updateProject,
} from '../../services/projects'
import { errorText, formatDate, formatMoney, num } from '../../utils/format'
import { PROJECT_STATUSES } from '../../utils/labels'
import { sw } from '../../utils/swahili'
import { validateImage } from '../../utils/validators'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { role } = useAuth()
  const { settings } = useSettings()
  const [tick, setTick] = useState(0)
  const [project, setProject] = useState(null)
  const [materials, setMaterials] = useState([])
  const [stock, setStock] = useState([])
  const [team, setTeam] = useState([])
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [usage, setUsage] = useState({ itemId: '', quantity: '', note: '' })
  const isAdmin = role === 'admin'

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([
      getProject(id),
      listProjectMaterials(id),
      listMaterials(),
      isAdmin ? listEmployees() : Promise.resolve([]),
    ])
      .then(async ([nextProject, nextMaterials, nextStock, nextTeam]) => {
        if (!active) return
        setProject(nextProject)
        setNotes(nextProject.notes || '')
        setMaterials(nextMaterials)
        setStock(nextStock)
        setTeam(nextTeam)
        const urls = {}
        await Promise.all(
          (nextProject.project_images || []).map(async (image) => {
            urls[image.id] = await signedUrl('project-files', image.image_path).catch(() => '')
          }),
        )
        if (active) setImages(urls)
        setLoading(false)
      })
      .catch((error) => {
        if (!active) return
        toast.error(errorText(error))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, tick, isAdmin])

  if (loading || !project) return <Spinner />

  const materialCost = materials.reduce((sum, row) => sum + num(row.quantity) * num(row.unit_cost), 0)
  const stages = [...(project.project_stages || [])].sort((a, b) => a.sort_order - b.sort_order)

  async function saveNotes() {
    try {
      await updateProject(project.id, { notes })
      toast.success('Maelezo yamehifadhiwa')
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  async function changeStage(stage, status) {
    try {
      await setStage(project.id, stage.stage_key, status, stage.notes)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  async function allocate(event) {
    event.preventDefault()
    try {
      await moveStock({
        itemId: usage.itemId,
        type: 'allocation',
        quantity: usage.quantity,
        projectId: project.id,
        note: usage.note,
      })
      toast.success('Vifaa vimeandikwa')
      setUsage({ itemId: '', quantity: '', note: '' })
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  async function onImage(event) {
    const file = event.target.files?.[0]
    const problem = validateImage(file)
    if (problem) {
      toast.error(problem)
      return
    }
    try {
      const path = await uploadFile('project-files', file, `projects/${project.id}`)
      await addProjectImage(project.id, path, '')
      toast.success('Picha imeongezwa')
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  return (
    <div>
      <PageHeader
        title={project.project_number}
        text={`${project.customers?.full_name || 'Mteja'} · Mwisho ${formatDate(project.expected_completion_date)}`}
        action={<StatusBadge status={project.status} list={PROJECT_STATUSES} />}
      />
      <p className="mb-4 whitespace-pre-wrap text-sm text-muted">{project.description}</p>
      <p className="mb-6 text-sm">Maendeleo {project.progress_percent}%</p>
      <div className="mb-6 h-2 rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-accent" style={{ width: `${project.progress_percent}%` }} />
      </div>

      {isAdmin && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <article className="rounded-lg border border-line bg-card p-4">
            <p className="text-xs uppercase text-muted">Bei ya kazi</p>
            <p className="text-xl">{formatMoney(project.budget, settings.currency_code)}</p>
          </article>
          <article className="rounded-lg border border-line bg-card p-4">
            <p className="text-xs uppercase text-muted">Vifaa vilivyotumika</p>
            <p className="text-xl">{formatMoney(materialCost, settings.currency_code)}</p>
          </article>
          <article className="rounded-lg border border-line bg-card p-4">
            <p className="text-xs uppercase text-muted">Kazi</p>
            <input
              className={inputClass}
              type="number"
              min="0"
              defaultValue={project.labour_cost}
              onBlur={(event) => updateProject(project.id, { labour_cost: Number(event.target.value || 0) }).then(() => setTick((value) => value + 1)).catch((error) => toast.error(errorText(error)))}
            />
          </article>
        </div>
      )}

      {isAdmin && (
        <Field label="Mfanyakazi aliyepewa">
          <select
            className={inputClass}
            value={project.assigned_employee_id || ''}
            onChange={async (event) => {
              try {
                await updateProject(project.id, { assigned_employee_id: event.target.value || null })
                setTick((value) => value + 1)
              } catch (error) {
                toast.error(errorText(error))
              }
            }}
          >
            <option value="">Hajapangiwa</option>
            {team.filter((person) => person.is_active).map((person) => (
              <option key={person.id} value={person.id}>{person.full_name}</option>
            ))}
          </select>
        </Field>
      )}

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Hatua za uzalishaji</h2>
        <ol className="mt-3 space-y-2">
          {stages.map((stage) => (
            <li key={stage.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-card px-3 py-2">
              <span>{stage.sort_order}. {sw(stage.stage_name)}</span>
              <span className="flex gap-2">
                <StatusBadge status={stage.status} />
                {stage.status !== 'in_progress' && stage.status !== 'done' && (
                  <Button type="button" variant="surface" onClick={() => changeStage(stage, 'in_progress')}>Anza</Button>
                )}
                {stage.status !== 'done' && (
                  <Button type="button" variant="surface" onClick={() => changeStage(stage, 'done')}>Imekamilika</Button>
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <form onSubmit={allocate} className="mt-8 grid gap-3 rounded-lg border border-line bg-card p-4 md:grid-cols-4">
        <h2 className="font-display text-2xl uppercase md:col-span-4">Tumia vifaa</h2>
        <select className={inputClass} required value={usage.itemId} onChange={(event) => setUsage({ ...usage, itemId: event.target.value })}>
          <option value="">Kifaa</option>
          {stock.map((item) => (
            <option key={item.id} value={item.id}>{item.name} ({num(item.quantity_available)} {item.unit})</option>
          ))}
        </select>
        <input className={inputClass} required type="number" min="0.01" step="0.01" placeholder="Idadi" value={usage.quantity} onChange={(event) => setUsage({ ...usage, quantity: event.target.value })} />
        <input className={inputClass} placeholder="Maelezo" value={usage.note} onChange={(event) => setUsage({ ...usage, note: event.target.value })} />
        <Button type="submit">Andika matumizi</Button>
      </form>
      <ul className="mt-3 space-y-1 text-sm text-muted">
        {materials.map((row) => (
          <li key={row.id}>{row.material_name}: {row.quantity} {row.unit}{row.unit_cost != null ? ` · ${formatMoney(num(row.quantity) * num(row.unit_cost), settings.currency_code)}` : ''}</li>
        ))}
      </ul>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Maelezo</h2>
        <textarea className={`${inputClass} mt-2`} rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
        <Button type="button" className="mt-2" onClick={saveNotes}>Hifadhi maelezo</Button>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase">Picha za rejea</h2>
        <input className="mt-2 text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={onImage} />
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(project.project_images || []).map((image) => (
            images[image.id] ? <img key={image.id} src={images[image.id]} alt={image.caption || 'Picha ya mradi'} className="h-32 w-full rounded-md object-cover" /> : null
          ))}
        </div>
      </section>
    </div>
  )
}
