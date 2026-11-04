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
        title="Quotations"
        text="Incoming requests stay separate from the priced quotation you send."
        action={<Link to="/admin/quotations/new" className={buttonClass('primary')}>New quotation</Link>}
      />
      <div className="mb-4 flex gap-2">
        <Button type="button" variant={tab === 'requests' ? 'primary' : 'surface'} onClick={() => setTab('requests')}>Requests</Button>
        <Button type="button" variant={tab === 'quotes' ? 'primary' : 'surface'} onClick={() => setTab('quotes')}>Priced quotations</Button>
      </div>
      {active.loading && <Spinner />}
      {active.error && <p className="text-sm text-red-700">{errorText(active.error)}</p>}
      {!active.loading && tab === 'requests' && (
        <DataTable
          rows={requests.data || []}
          rowKey={(row) => row.id}
          empty="No quotation requests yet"
          columns={[
            { key: 'ref', header: 'Reference', cell: (row) => <Link className="text-accent" to={`/admin/requests/${row.id}`}>{row.reference_number}</Link> },
            { key: 'who', header: 'Customer', cell: (row) => row.customer_name },
            { key: 'title', header: 'Work', cell: (row) => row.project_title },
            { key: 'date', header: 'Received', cell: (row) => formatDate(row.created_at) },
            { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} list={REQUEST_STATUSES} /> },
          ]}
        />
      )}
      {!active.loading && tab === 'quotes' && (
        <DataTable
          rows={quotes.data || []}
          rowKey={(row) => row.id}
          empty="No priced quotations yet"
          columns={[
            { key: 'no', header: 'Number', cell: (row) => <Link className="text-accent" to={`/admin/quotations/${row.id}`}>{row.quotation_number}</Link> },
            { key: 'who', header: 'Customer', cell: (row) => row.customers?.full_name },
            { key: 'title', header: 'Title', cell: (row) => row.title },
            { key: 'total', header: 'Total', cell: (row) => formatMoney(row.total, settings.currency_code) },
            { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} list={QUOTE_STATUSES} /> },
          ]}
        />
      )}
    </div>
  )
}
