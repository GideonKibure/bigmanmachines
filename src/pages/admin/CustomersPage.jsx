import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import DataTable from '../../components/common/DataTable'
import Field, { inputClass } from '../../components/common/Field'
import Modal from '../../components/common/Modal'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useLoad } from '../../hooks/useLoad'
import { listCustomers, saveCustomer, setCustomerArchived } from '../../services/customers'
import { errorText } from '../../utils/format'

const blank = { full_name: '', phone: '', email: '', location: '', notes: '' }

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [archived, setArchived] = useState(false)
  const [tick, setTick] = useState(0)
  const [form, setForm] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const { data, loading, error } = useLoad(() => listCustomers({ search, archived }), [search, archived, tick])

  async function onSave(event) {
    event.preventDefault()
    try {
      await saveCustomer(form)
      toast.success('Customer saved')
      setForm(null)
      setTick((value) => value + 1)
    } catch (saveError) {
      toast.error(errorText(saveError))
    }
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        text="People and businesses you quote and build for."
        action={<Button type="button" onClick={() => setForm(blank)}>Add customer</Button>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <input className={`${inputClass} max-w-xs`} placeholder="Search name or phone" value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button type="button" variant="surface" onClick={() => setArchived((value) => !value)}>
          {archived ? 'Showing archived' : 'Show archived'}
        </Button>
      </div>
      {loading && <Spinner />}
      {error && <p className="text-sm text-red-700">{errorText(error)}</p>}
      {!loading && (
        <DataTable
          rows={data || []}
          rowKey={(row) => row.id}
          empty="No customers yet"
          columns={[
            { key: 'name', header: 'Name', cell: (row) => <Link className="text-accent" to={`/admin/customers/${row.id}`}>{row.full_name}</Link> },
            { key: 'phone', header: 'Phone', cell: (row) => row.phone },
            { key: 'location', header: 'Location', cell: (row) => row.location || '—' },
            {
              key: 'actions',
              header: '',
              cell: (row) => (
                <button
                  type="button"
                  className="text-sm text-muted hover:text-ink"
                  onClick={() => setConfirm(row)}
                >
                  {row.archived_at ? 'Restore' : 'Archive'}
                </button>
              ),
            },
          ]}
        />
      )}
      <Modal open={Boolean(form)} title={form?.id ? 'Edit customer' : 'New customer'} onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={onSave} className="space-y-3">
            <Field label="Name"><input className={inputClass} required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} /></Field>
            <Field label="Phone"><input className={inputClass} required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></Field>
            <Field label="Email"><input className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></Field>
            <Field label="Location"><input className={inputClass} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></Field>
            <Field label="Notes"><textarea className={inputClass} rows={3} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field>
            <Button type="submit">Save customer</Button>
          </form>
        )}
      </Modal>
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.archived_at ? 'Restore customer' : 'Archive customer'}
        text={confirm?.archived_at ? 'This customer will show in the active list again.' : 'Archived customers stay on old orders but drop off the active list.'}
        confirmLabel={confirm?.archived_at ? 'Restore' : 'Archive'}
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          try {
            await setCustomerArchived(confirm.id, !confirm.archived_at)
            toast.success('Customer updated')
            setConfirm(null)
            setTick((value) => value + 1)
          } catch (archiveError) {
            toast.error(errorText(archiveError))
          }
        }}
      />
    </div>
  )
}
