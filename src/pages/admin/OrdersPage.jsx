import { Link } from 'react-router-dom'
import DataTable from '../../components/common/DataTable'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { listOrders } from '../../services/orders'
import { errorText, formatDate, formatMoney } from '../../utils/format'
import { ORDER_STATUSES } from '../../utils/labels'

export default function OrdersPage() {
  const { settings } = useSettings()
  const { data, loading, error } = useLoad(() => listOrders(), [])
  if (loading) return <Spinner />
  if (error) return <p className="text-sm text-red-700">{errorText(error)}</p>

  return (
    <div>
      <PageHeader title="Orders" text="An order is created when a quotation is accepted." />
      <DataTable
        rows={data || []}
        rowKey={(row) => row.id}
        empty="No orders yet"
        columns={[
          { key: 'no', header: 'Order', cell: (row) => <Link className="text-accent" to={`/admin/orders/${row.id}`}>{row.order_number}</Link> },
          { key: 'who', header: 'Customer', cell: (row) => row.customers?.full_name },
          { key: 'price', header: 'Agreed price', cell: (row) => formatMoney(row.agreed_price, settings.currency_code) },
          { key: 'due', header: 'Due', cell: (row) => formatDate(row.expected_completion_date) },
          { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} list={ORDER_STATUSES} /> },
        ]}
      />
    </div>
  )
}
