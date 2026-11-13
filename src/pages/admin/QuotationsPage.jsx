import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button, { buttonClass } from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { listQuotations, listRequests } from '../../services/quotes'
import { errorText, formatDate, formatMoney } from '../../utils/format'
import { QUOTE_STATUSES, REQUEST_STATUSES } from '../../utils/labels'

export default function QuotationsPage() {
  const { settings } = useSettings()
  const [tab, setTab] = useState('requests')
  const requests = useLoad(() => listRequests(), [])
  const quotes = useLoad(() => listQuotations(), [])
  const active = tab === 'requests' ? requests : quotes

  return (
    <div>
      <PageHeader
        title="Makadirio"
        text="Maombi yanayoingia hubaki tofauti na makadirio yenye bei unayotuma."
        action={<Link to="/admin/quotations/new" className={buttonClass('primary')}>Makadirio mapya</Link>}
      />
      <div className="mb-4 flex gap-2">
        <Button type="button" variant={tab === 'requests' ? 'primary' : 'surface'} onClick={() => setTab('requests')}>Maombi</Button>
        <Button type="button" variant={tab === 'quotes' ? 'primary' : 'surface'} onClick={() => setTab('quotes')}>Makadirio yenye bei</Button>
      </div>
      {active.loading && <Spinner />}
      {active.error && <p className="text-sm text-red-700">{errorText(active.error)}</p>}
      {!active.loading && tab === 'requests' && (
        <DataTable
          rows={requests.data || []}
          rowKey={(row) => row.id}
          empty="Bado hakuna maombi ya bei"
          columns={[
            { key: 'ref', header: 'Nambari', cell: (row) => <Link className="text-accent" to={`/admin/requests/${row.id}`}>{row.reference_number}</Link> },
            { key: 'who', header: 'Mteja', cell: (row) => row.customer_name },
            { key: 'title', header: 'Kazi', cell: (row) => row.project_title },
            { key: 'date', header: 'Imepokelewa', cell: (row) => formatDate(row.created_at) },
            { key: 'status', header: 'Hali', cell: (row) => <StatusBadge status={row.status} list={REQUEST_STATUSES} /> },
          ]}
        />
      )}
      {!active.loading && tab === 'quotes' && (
        <DataTable
          rows={quotes.data || []}
          rowKey={(row) => row.id}
          empty="Bado hakuna makadirio yenye bei"
          columns={[
            { key: 'no', header: 'Nambari', cell: (row) => <Link className="text-accent" to={`/admin/quotations/${row.id}`}>{row.quotation_number}</Link> },
            { key: 'who', header: 'Mteja', cell: (row) => row.customers?.full_name },
            { key: 'title', header: 'Kichwa', cell: (row) => row.title },
            { key: 'total', header: 'Jumla', cell: (row) => formatMoney(row.total, settings.currency_code) },
            { key: 'status', header: 'Hali', cell: (row) => <StatusBadge status={row.status} list={QUOTE_STATUSES} /> },
          ]}
        />
      )}
    </div>
  )
}
