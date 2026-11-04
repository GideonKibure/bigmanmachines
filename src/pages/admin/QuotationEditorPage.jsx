import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useSettings } from '../../contexts/SettingsContext'
import { listCustomers } from '../../services/customers'
import { convertQuotation, getQuotation, getRequest, saveQuotation } from '../../services/quotes'
import { errorText, formatMoney, todayInput } from '../../utils/format'
import { QUOTE_STATUSES } from '../../utils/labels'
import { priceQuote } from '../../utils/pricing'

const blank = {
  customer_id: '',
  quotation_request_id: '',
  title: '',
  description: '',
  status: 'under_review',
  material_cost: '0',
  labour_cost: '0',
  transport_cost: '0',
  other_cost: '0',
  profit_margin_percent: '30',
  valid_until: '',
  notes: '',
  items: [],
}

export default function QuotationEditorPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [form, setForm] = useState(blank)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [due, setDue] = useState(todayInput())

  useEffect(() => {
    let active = true
    async function load() {
      const people = await listCustomers()
      if (!active) return
      setCustomers(people)
      if (id) {
        const quote = await getQuotation(id)
        if (!active) return
        setForm({
          ...blank,
          ...quote,
          quotation_request_id: quote.quotation_request_id || '',
          material_cost: quote.material_cost,
          labour_cost: quote.labour_cost,
          transport_cost: quote.transport_cost,
          other_cost: quote.other_cost,
          profit_margin_percent: quote.profit_margin_percent,
          valid_until: quote.valid_until || '',
          items: (quote.quotation_items || []).map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
          })),
        })
      } else if (params.get('request')) {
        const request = await getRequest(params.get('request'))
        if (!active) return
        setForm((current) => ({
          ...current,
          quotation_request_id: request.id,
          customer_id: request.customer_id || '',
          title: request.project_title,
          description: request.description,
          status: 'under_review',
        }))
        if (request.preferred_completion_date) setDue(request.preferred_completion_date)
      }
      setLoading(false)
    }
    load().catch((error) => {
      toast.error(errorText(error))
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [id, params])

  const priced = priceQuote({
    material: form.material_cost,
    labour: form.labour_cost,
    transport: form.transport_cost,
    other: form.other_cost,
    margin: form.profit_margin_percent,
    items: form.items,
  })

  function payload(status = form.status) {
    return {
      id: id || null,
      customer_id: form.customer_id,
      quotation_request_id: form.quotation_request_id || null,
      title: form.title,
      description: form.description,
      status,
      material_cost: Number(form.material_cost || 0),
      labour_cost: Number(form.labour_cost || 0),
      transport_cost: Number(form.transport_cost || 0),
      other_cost: Number(form.other_cost || 0),
      profit_margin_percent: Number(form.profit_margin_percent || 0),
      valid_until: form.valid_until || null,
      notes: form.notes,
      items: form.items,
    }
  }

  async function onSave(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const saved = await saveQuotation(payload())
      toast.success('Quotation saved')
      if (!id) navigate(`/admin/quotations/${saved}`, { replace: true })
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setSaving(false)
    }
  }

  async function onConvert() {
    setSaving(true)
    try {
      const saved = await saveQuotation(payload('accepted'))
      const orderId = await convertQuotation(saved, due)
      toast.success('Order created')
      navigate(`/admin/orders/${orderId}`)
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <form onSubmit={onSave}>
      <PageHeader
        title={id ? 'Edit quotation' : 'New quotation'}
        text="The amount due is the cost plus margin, unless every line has its own price. Those line prices then become the total."
        action={id && <Link to={`/admin/quotations/${id}/print`} className="text-sm text-accent">Print</Link>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Customer">
          <select className={inputClass} required value={form.customer_id} onChange={(event) => setForm({ ...form, customer_id: event.target.value })}>
            <option value="">Choose</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.full_name}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            {QUOTE_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="Title">
          <input className={inputClass} required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </Field>
        <Field label="Valid until">
          <input className={inputClass} type="date" value={form.valid_until || ''} onChange={(event) => setForm({ ...form, valid_until: event.target.value })} />
        </Field>
        <div className="lg:col-span-2">
          <Field label="Description">
            <textarea className={inputClass} rows={3} value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
        </div>
        {['material_cost', 'labour_cost', 'transport_cost', 'other_cost'].map((key) => (
          <Field key={key} label={key.replaceAll('_', ' ')}>
            <input className={inputClass} type="number" min="0" step="0.01" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
          </Field>
        ))}
        <Field label="Profit margin %" hint={priced.fromItems ? 'Recalculated from the line prices.' : 'Applied to the costs above.'}>
          <input className={inputClass} type="number" min="0" step="0.01" value={form.profit_margin_percent} onChange={(event) => setForm({ ...form, profit_margin_percent: event.target.value })} />
        </Field>
        <div className="lg:col-span-2">
          <Field label="Internal notes">
            <textarea className={inputClass} rows={2} value={form.notes || ''} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl uppercase">Customer lines</h2>
          <Button
            type="button"
            variant="surface"
            onClick={() => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unit: 'pcs', unit_price: '' }] })}
          >
            Add line
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {form.items.map((item, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-5">
              <input className={inputClass} placeholder="Description" value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} />
              <input className={inputClass} type="number" min="0" value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} />
              <input className={inputClass} placeholder="Unit" value={item.unit} onChange={(event) => updateItem(index, 'unit', event.target.value)} />
              <input className={inputClass} type="number" min="0" placeholder="Price" value={item.unit_price} onChange={(event) => updateItem(index, 'unit_price', event.target.value)} />
              <Button type="button" variant="surface" onClick={() => setForm({ ...form, items: form.items.filter((_, itemIndex) => itemIndex !== index) })}>Remove</Button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Costs {formatMoney(priced.costs, settings.currency_code)}</p>
        <p className="font-display text-4xl text-accent">{formatMoney(priced.selling, settings.currency_code)}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save quotation'}</Button>
        <Field label="Expected completion">
          <input className={inputClass} type="date" value={due} onChange={(event) => setDue(event.target.value)} />
        </Field>
        <Button type="button" variant="surface" disabled={saving} onClick={onConvert}>Accept and create order</Button>
      </div>
    </form>
  )

  function updateItem(index, key, value) {
    const items = form.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    setForm({ ...form, items })
  }
}
