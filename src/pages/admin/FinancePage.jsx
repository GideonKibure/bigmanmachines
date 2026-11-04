import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { listCustomers } from '../../services/customers'
import { listTransactions, recordTransaction } from '../../services/finance'
import { listOrders } from '../../services/orders'
import { listProjects } from '../../services/projects'
import { errorText, formatDate, formatMoney, num, todayInput } from '../../utils/format'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, labelOf } from '../../utils/labels'
import { validateReceipt } from '../../utils/validators'

export default function FinancePage() {
  const { settings } = useSettings()
  const [tick, setTick] = useState(0)
  const [type, setType] = useState('income')
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    type: 'income',
    category: 'other_income',
    amount: '',
    transaction_date: todayInput(),
    description: '',
    payment_method: 'cash',
    customer_id: '',
    order_id: '',
    project_id: '',
  })
  const transactions = useLoad(() => listTransactions(), [tick])
  const customers = useLoad(() => listCustomers(), [])
  const orders = useLoad(() => listOrders(), [])
  const projects = useLoad(() => listProjects(), [])

  const rows = transactions.data || []
  const income = rows.filter((row) => row.type === 'income').reduce((sum, row) => sum + num(row.amount), 0)
  const expenses = rows.filter((row) => row.type === 'expense').reduce((sum, row) => sum + num(row.amount), 0)
  const money = (value) => formatMoney(value, settings.currency_code)
  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  async function onSubmit(event) {
    event.preventDefault()
    const fileError = validateReceipt(file)
    if (fileError) {
      toast.error(fileError)
      return
    }
    try {
      await recordTransaction(form, file)
      toast.success('Transaction saved')
      setForm({ ...form, amount: '', description: '' })
      setFile(null)
      setTick((value) => value + 1)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  return (
    <div>
      <PageHeader title="Finance" text="Cash that has actually moved. Outstanding balances stay on the customer and order pages." />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-lg border border-line bg-card p-4"><p className="text-xs uppercase text-muted">Income</p><p className="text-2xl">{money(income)}</p></article>
        <article className="rounded-lg border border-line bg-card p-4"><p className="text-xs uppercase text-muted">Expenses</p><p className="text-2xl">{money(expenses)}</p></article>
        <article className="rounded-lg border border-line bg-card p-4"><p className="text-xs uppercase text-muted">Net cash</p><p className="text-2xl">{money(income - expenses)}</p></article>
      </div>
      <form onSubmit={onSubmit} className="mb-8 grid gap-3 rounded-lg border border-line bg-card p-4 md:grid-cols-3">
        <Field label="Type">
          <select className={inputClass} value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value, category: event.target.value === 'income' ? 'other_income' : 'other_expense' })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </Field>
        <Field label="Category">
          <select className={inputClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="Amount"><input className={inputClass} required type="number" min="1" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></Field>
        <Field label="Date"><input className={inputClass} type="date" value={form.transaction_date} onChange={(event) => setForm({ ...form, transaction_date: event.target.value })} /></Field>
        <Field label="Method">
          <select className={inputClass} value={form.payment_method} onChange={(event) => setForm({ ...form, payment_method: event.target.value })}>
            {PAYMENT_METHODS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="Description"><input className={inputClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
        <Field label="Customer">
          <select className={inputClass} value={form.customer_id} onChange={(event) => setForm({ ...form, customer_id: event.target.value })}>
            <option value="">None</option>
            {(customers.data || []).map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name}</option>)}
          </select>
        </Field>
        <Field label="Order">
          <select className={inputClass} value={form.order_id} onChange={(event) => setForm({ ...form, order_id: event.target.value })}>
            <option value="">None</option>
            {(orders.data || []).map((order) => <option key={order.id} value={order.id}>{order.order_number}</option>)}
          </select>
        </Field>
        <Field label="Project">
          <select className={inputClass} value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value })}>
            <option value="">None</option>
            {(projects.data || []).map((project) => <option key={project.id} value={project.id}>{project.project_number}</option>)}
          </select>
        </Field>
        <Field label="Receipt or invoice">
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </Field>
        <div className="md:col-span-3"><Button type="submit">Save transaction</Button></div>
      </form>
      <div className="mb-3 flex gap-2">
        <Button type="button" variant={type === 'income' ? 'primary' : 'surface'} onClick={() => setType('income')}>Income</Button>
        <Button type="button" variant={type === 'expense' ? 'primary' : 'surface'} onClick={() => setType('expense')}>Expenses</Button>
      </div>
      {transactions.loading ? <Spinner /> : (
        <DataTable
          rows={rows.filter((row) => row.type === type)}
          rowKey={(row) => row.id}
          empty="No transactions yet"
          columns={[
            { key: 'date', header: 'Date', cell: (row) => formatDate(row.transaction_date) },
            { key: 'category', header: 'Category', cell: (row) => labelOf(row.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES, row.category) },
            { key: 'desc', header: 'Description', cell: (row) => row.description || '—' },
            { key: 'who', header: 'Linked', cell: (row) => row.customers?.full_name || row.orders?.order_number || row.projects?.project_number || '—' },
            { key: 'amount', header: 'Amount', cell: (row) => money(row.amount) },
          ]}
        />
      )}
    </div>
  )
}
