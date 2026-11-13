import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import Field, { inputClass } from '../../components/common/Field'
import Modal from '../../components/common/Modal'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { listEmployees, listProfiles, saveEmployee } from '../../services/finance'
import { errorText, formatMoney } from '../../utils/format'

const blank = { full_name: '', phone: '', job_title: 'Fundi', default_daily_rate: 0, is_active: true, profile_id: '' }

export default function EmployeesPage() {
  const { settings } = useSettings()
  const [tick, setTick] = useState(0)
  const [form, setForm] = useState(null)
  const employees = useLoad(() => listEmployees(), [tick])
  const profiles = useLoad(() => listProfiles(), [tick])

  async function onSave(event) {
    event.preventDefault()
    try {
      await saveEmployee(form)
      toast.success('Mwanatimu amehifadhiwa')
      setForm(null)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  if (employees.loading) return <Spinner />

  return (
    <div>
      <PageHeader
        title="Timu"
        text="Mtunze mtu hapa. Ili aingie, ongeza mtumiaji kwenye Supabase Authentication, kisha unganisha akaunti hapa chini. Akaunti mpya huanza kama mfanyakazi hadi umpandishe msimamizi kwa SQL."
        action={<Button type="button" onClick={() => setForm(blank)}>Ongeza mtu</Button>}
      />
      {employees.error && <p className="mb-3 text-sm text-red-700">{errorText(employees.error)}</p>}
      <DataTable
        rows={employees.data || []}
        rowKey={(row) => row.id}
        empty="Bado hakuna wanatimu"
        columns={[
          { key: 'name', header: 'Jina', cell: (row) => <button type="button" className="text-accent" onClick={() => setForm({ ...row, profile_id: row.profile_id || '' })}>{row.full_name}</button> },
          { key: 'title', header: 'Cheo', cell: (row) => row.job_title },
          { key: 'rate', header: 'Kiwango cha siku', cell: (row) => formatMoney(row.default_daily_rate, settings.currency_code) },
          { key: 'login', header: 'Akaunti', cell: (row) => row.profiles?.email || 'Hakuna akaunti iliyounganishwa' },
          { key: 'active', header: 'Hai', cell: (row) => (row.is_active ? 'Yes' : 'No') },
        ]}
      />
      <Modal open={Boolean(form)} title="Mwanatimu" onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={onSave} className="grid gap-3">
            <Field label="Jina"><input className={inputClass} required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} /></Field>
            <Field label="Simu"><input className={inputClass} value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <Field label="Cheo"><input className={inputClass} value={form.job_title} onChange={(event) => setForm({ ...form, job_title: event.target.value })} /></Field>
            <Field label="Kiwango cha siku"><input className={inputClass} type="number" min="0" value={form.default_daily_rate} onChange={(event) => setForm({ ...form, default_daily_rate: event.target.value })} /></Field>
            <Field label="Akaunti iliyounganishwa">
              <select className={inputClass} value={form.profile_id || ''} onChange={(event) => setForm({ ...form, profile_id: event.target.value })}>
                <option value="">Hakuna akaunti</option>
                {(profiles.data || []).map((profile) => (
                  <option key={profile.id} value={profile.id}>{profile.full_name} · {profile.email}</option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active !== false} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
              Active
            </label>
            <Button type="submit">Hifadhi</Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
