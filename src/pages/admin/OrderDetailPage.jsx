import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useSettings } from '../../contexts/SettingsContext'
import { recordTransaction } from '../../services/finance'
import { addDelivery, getOrder, updateOrder } from '../../services/orders'
import { errorText, formatDate, formatMoney, num, todayInput } from '../../utils/format'
import { INCOME_CATEGORIES, ORDER_STATUSES, PAYMENT_METHODS } from '../../utils/labels'
import { validateReceipt } from '../../utils/validators'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { settings } = useSettings()
  const [tick, setTick] = useState(0)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [payment, setPayment] = useState({
    amount: '',
    category: 'deposit',
    payment_method: 'cash',
    transaction_date: todayInput(),
    description: '',
  })
  const [file, setFile] = useState(null)
  const [delivery, setDelivery] = useState({ received_by: '', notes: '' })

  useEffect(() => {
    let active = true
    setLoading(true)
    getOrder(id)
      .then((data) => {
        if (!active) return
        setOrder(data)
        setError(null)
        setLoading(false)
      })
      .catch((loadError) => {
        if (!active) return
        setError(loadError)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, tick])

  if (loading) return <Spinner />
  if (error || !order) return <p className="text-sm text-red-700">{errorText(error)}</p>

  const paid = (order.payments || []).reduce((sum, row) => sum + num(row.amount), 0)
  const deposit = (order.payments || []).filter((row) => row.category === 'deposit').reduce((sum, row) => sum + num(row.amount), 0)
  const money = (value) => formatMoney(value, settings.currency_code)

  async function saveStatus(status) {
    try {
      await updateOrder(order.id, { status })
      if (status === 'delivered') await addDelivery(order.id, delivery)
      toast.success('Oda imesasishwa')
      setTick((value) => value + 1)
    } catch (saveError) {
      toast.error(errorText(saveError))
    }
  }

  async function savePayment(event) {
    event.preventDefault()
    const fileError = validateReceipt(file)
    if (fileError) {
      toast.error(fileError)
      return
    }
    try {
      await recordTransaction(
        {
          ...payment,
          type: 'income',
          customer_id: order.customer_id,
          order_id: order.id,
          project_id: order.projects?.id || null,
        },
        file,
      )
      toast.success('Malipo yameandikwa')
      setPayment({ ...payment, amount: '', description: '' })
      setFile(null)
      setTick((value) => value + 1)
    } catch (saveError) {
      toast.error(errorText(saveError))
    }
  }

  return (
    <div>
      <PageHeader title={order.order_number} text={order.customers?.full_name} />
      <p className="mb-4 whitespace-pre-wrap text-sm text-muted">{order.description}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs uppercase text-muted">Bei iliyokubaliwa</p>
          <p className="mt-1 text-2xl">{money(order.agreed_price)}</p>
        </article>
        <article className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs uppercase text-muted">Amana iliyopokelewa</p>
          <p className="mt-1 text-2xl">{money(deposit)}</p>
        </article>
        <article className="rounded-lg border border-line bg-card p-4">
          <p className="text-xs uppercase text-muted">Salio</p>
          <p className="mt-1 text-2xl">{money(num(order.agreed_price) - paid)}</p>
        </article>
      </div>
      <p className="mt-3 text-sm text-muted">Tarehe ya kukamilika {formatDate(order.expected_completion_date)}</p>
      {order.projects && (
        <Link to={`/admin/projects/${order.projects.id}`} className="mt-2 inline-block text-sm text-accent">
          Fungua mradi {order.projects.project_number}
        </Link>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-card p-4">
          <h2 className="mb-3 font-display text-2xl uppercase">Hali</h2>
          <Field label="Hali ya oda">
            <select className={inputClass} value={order.status} onChange={(event) => saveStatus(event.target.value)}>
              {ORDER_STATUSES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <div className="mt-3 grid gap-2">
            <Field label="Aliyepokea, ikiwa imetolewa">
              <input className={inputClass} value={delivery.received_by} onChange={(event) => setDelivery({ ...delivery, received_by: event.target.value })} />
            </Field>
            <Field label="Maelezo ya utoaji">
              <input className={inputClass} value={delivery.notes} onChange={(event) => setDelivery({ ...delivery, notes: event.target.value })} />
            </Field>
          </div>
        </section>
        <form onSubmit={savePayment} className="space-y-3 rounded-lg border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Andika malipo</h2>
          <Field label="Kiasi">
            <input className={inputClass} required type="number" min="1" step="0.01" value={payment.amount} onChange={(event) => setPayment({ ...payment, amount: event.target.value })} />
          </Field>
          <Field label="Kundi">
            <select className={inputClass} value={payment.category} onChange={(event) => setPayment({ ...payment, category: event.target.value })}>
              {INCOME_CATEGORIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Njia">
            <select className={inputClass} value={payment.payment_method} onChange={(event) => setPayment({ ...payment, payment_method: event.target.value })}>
              {PAYMENT_METHODS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Tarehe">
            <input className={inputClass} type="date" value={payment.transaction_date} onChange={(event) => setPayment({ ...payment, transaction_date: event.target.value })} />
          </Field>
          <Field label="Maelezo">
            <input className={inputClass} value={payment.description} onChange={(event) => setPayment({ ...payment, description: event.target.value })} />
          </Field>
          <Field label="Risiti">
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </Field>
          <Button type="submit">Hifadhi malipo</Button>
        </form>
      </div>
      <section className="mt-6">
        <h2 className="mb-2 font-display text-2xl uppercase">Malipo</h2>
        <div className="space-y-2 text-sm">
          {(order.payments || []).map((row) => (
            <p key={row.id} className="flex justify-between rounded-md border border-line px-3 py-2">
              <span>{formatDate(row.transaction_date)} · {row.category}</span>
              <span>{money(row.amount)}</span>
            </p>
          ))}
          {!order.payments?.length && <p className="text-muted">Hakuna malipo yaliyoandikwa.</p>}
        </div>
      </section>
    </div>
  )
}
