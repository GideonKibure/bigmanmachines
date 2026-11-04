import { Link, useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { getCustomer } from '../../services/customers'
import { errorText, formatDate, formatMoney, num } from '../../utils/format'
import { ORDER_STATUSES, QUOTE_STATUSES } from '../../utils/labels'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const { settings } = useSettings()
  const { data, loading, error } = useLoad(() => getCustomer(id), [id])
  if (loading) return <Spinner />
  if (error) return <EmptyState title="Could not open this customer" text={errorText(error)} />

  const agreed = (data.orders || [])
    .filter((order) => order.status !== 'cancelled')
    .reduce((sum, order) => sum + num(order.agreed_price), 0)
  const paid = (data.payments || []).reduce((sum, payment) => sum + num(payment.amount), 0)

  return (
    <div>
      <PageHeader title={data.customer.full_name} text={`${data.customer.phone} · ${data.customer.location || 'No location'}`} />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs uppercase text-muted">Agreed work</p>
          <p className="mt-1 text-2xl">{formatMoney(agreed, settings.currency_code)}</p>
        </article>
        <article className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs uppercase text-muted">Cash received</p>
          <p className="mt-1 text-2xl">{formatMoney(paid, settings.currency_code)}</p>
        </article>
        <article className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs uppercase text-muted">Outstanding</p>
          <p className="mt-1 text-2xl">{formatMoney(agreed - paid, settings.currency_code)}</p>
        </article>
      </div>
      {data.customer.notes && <p className="mb-6 text-sm text-muted">{data.customer.notes}</p>}
      <section className="mb-8">
        <h2 className="mb-3 font-display text-2xl uppercase">Quotations</h2>
        <div className="space-y-2">
          {(data.quotes || []).map((quote) => (
            <Link key={quote.id} to={`/admin/quotations/${quote.id}`} className="flex items-center justify-between rounded-md border border-line bg-card px-3 py-2 text-sm">
              <span>{quote.quotation_number} · {quote.title}</span>
              <StatusBadge status={quote.status} list={QUOTE_STATUSES} />
            </Link>
          ))}
          {!data.quotes?.length && <p className="text-sm text-muted">No quotations yet.</p>}
        </div>
      </section>
      <section>
        <h2 className="mb-3 font-display text-2xl uppercase">Orders</h2>
        <div className="space-y-2">
          {(data.orders || []).map((order) => (
            <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between rounded-md border border-line bg-card px-3 py-2 text-sm">
              <span>{order.order_number} · {formatDate(order.created_at)} · {formatMoney(order.agreed_price, settings.currency_code)}</span>
              <StatusBadge status={order.status} list={ORDER_STATUSES} />
            </Link>
          ))}
          {!data.orders?.length && <p className="text-sm text-muted">No orders yet.</p>}
        </div>
      </section>
    </div>
  )
}
