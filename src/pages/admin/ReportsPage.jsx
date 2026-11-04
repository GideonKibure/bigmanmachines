import { useMemo, useState } from 'react'
import Button from '../../components/common/Button'
import DataTable from '../../components/common/DataTable'
import Field, { inputClass } from '../../components/common/Field'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { listTransactions, reportOrders, reportProjects } from '../../services/finance'
import { listMovements } from '../../services/inventory'
import { downloadCsv } from '../../utils/csv'
import { errorText, formatDate, formatMoney, num, todayInput } from '../../utils/format'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, labelOf } from '../../utils/labels'

function monthStart() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}

export default function ReportsPage() {
  const { settings } = useSettings()
  const [from, setFrom] = useState(monthStart())
  const [to, setTo] = useState(todayInput())
  const [section, setSection] = useState('sales')
  const transactions = useLoad(() => listTransactions(), [])
  const projects = useLoad(() => reportProjects(), [])
  const orders = useLoad(() => reportOrders(), [])
  const movements = useLoad(() => listMovements(), [])
  const money = (value) => formatMoney(value, settings.currency_code)

  const allTransactions = transactions.data || []
  const inRange = allTransactions.filter((row) => row.transaction_date >= from && row.transaction_date <= to)
  const sales = useMemo(() => {
    const grouped = {}
    inRange.filter((row) => row.type === 'income').forEach((row) => {
      grouped[row.transaction_date] = (grouped[row.transaction_date] || 0) + num(row.amount)
    })
    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }))
  }, [inRange])

  const completed = (projects.data || []).filter((project) => {
    if (project.status !== 'completed' || !project.completed_at) return false
    const day = project.completed_at.slice(0, 10)
    return day >= from && day <= to
  })

  const profitRows = (projects.data || []).map((project) => {
    const materials = (project.project_materials || []).reduce((sum, row) => sum + num(row.quantity) * num(row.unit_cost_at_time), 0)
    const other = allTransactions
      .filter((row) => row.project_id === project.id && row.type === 'expense')
      .reduce((sum, row) => sum + num(row.amount), 0)
    const profit = num(project.budget) - materials - num(project.labour_cost) - other
    return {
      project: project.project_number,
      customer: project.customers?.full_name,
      price: num(project.budget),
      materials,
      labour: num(project.labour_cost),
      other,
      profit,
    }
  })

  const outstanding = (orders.data || [])
    .filter((order) => order.status !== 'cancelled')
    .map((order) => {
      const paid = allTransactions
        .filter((row) => row.order_id === order.id && row.type === 'income')
        .reduce((sum, row) => sum + num(row.amount), 0)
      return { order: order.order_number, customer: order.customers?.full_name, agreed: num(order.agreed_price), paid, balance: num(order.agreed_price) - paid }
    })
    .filter((row) => row.balance > 0)

  const movementRows = (movements.data || []).filter((row) => {
    const day = row.created_at.slice(0, 10)
    return day >= from && day <= to
  })

  const sections = {
    sales: sales.map((row) => ({ Date: row.date, Sales: row.amount })),
    expenses: inRange.filter((row) => row.type === 'expense').map((row) => ({
      Date: row.transaction_date,
      Category: labelOf(EXPENSE_CATEGORIES, row.category),
      Amount: num(row.amount),
      Description: row.description,
    })),
    profit: profitRows.map((row) => ({
      Project: row.project,
      Customer: row.customer,
      Price: row.price,
      Materials: row.materials,
      Labour: row.labour,
      Other: row.other,
      Profit: row.profit,
    })),
    stock: movementRows.map((row) => ({
      Date: formatDate(row.created_at),
      Material: row.inventory_items?.name,
      Type: row.movement_type,
      Quantity: num(row.quantity),
      Note: row.note,
    })),
    outstanding: outstanding.map((row) => ({
      Order: row.order,
      Customer: row.customer,
      Agreed: row.agreed,
      Paid: row.paid,
      Balance: row.balance,
    })),
    completed: completed.map((project) => ({
      Project: project.project_number,
      Customer: project.customers?.full_name,
      Completed: formatDate(project.completed_at),
    })),
  }

  const loading = transactions.loading || projects.loading || orders.loading || movements.loading
  const error = transactions.error || projects.error || orders.error || movements.error

  return (
    <div className="print-sheet">
      <PageHeader
        title="Reports"
        text="Figures come from saved transactions, orders, and stock movements."
        action={
          <span className="no-print flex gap-2">
            <Button type="button" variant="surface" onClick={() => window.print()}>Print</Button>
            <Button type="button" variant="surface" onClick={() => downloadCsv(`${section}-${from}.csv`, sections[section])}>Download CSV</Button>
          </span>
        }
      />
      <div className="no-print mb-4 flex flex-wrap gap-3">
        <Field label="From"><input className={inputClass} type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></Field>
        <Field label="To"><input className={inputClass} type="date" value={to} onChange={(event) => setTo(event.target.value)} /></Field>
      </div>
      <div className="no-print mb-4 flex flex-wrap gap-2">
        {[
          ['sales', 'Daily sales'],
          ['expenses', 'Expenses'],
          ['profit', 'Project profit'],
          ['stock', 'Stock movements'],
          ['outstanding', 'Outstanding'],
          ['completed', 'Completed projects'],
        ].map(([key, label]) => (
          <Button key={key} type="button" variant={section === key ? 'primary' : 'surface'} onClick={() => setSection(key)}>{label}</Button>
        ))}
      </div>
      {loading && <Spinner />}
      {error && <p className="text-sm text-red-700">{errorText(error)}</p>}
      {!loading && section === 'sales' && (
        <DataTable rows={sales} rowKey={(row) => row.date} empty="No sales in this period" columns={[
          { key: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
          { key: 'amount', header: 'Cash received', cell: (row) => money(row.amount) },
        ]} />
      )}
      {!loading && section === 'expenses' && (
        <DataTable
          rows={inRange.filter((row) => row.type === 'expense')}
          rowKey={(row) => row.id}
          empty="No expenses in this period"
          columns={[
            { key: 'date', header: 'Date', cell: (row) => formatDate(row.transaction_date) },
            { key: 'category', header: 'Category', cell: (row) => labelOf(EXPENSE_CATEGORIES, row.category) },
            { key: 'amount', header: 'Amount', cell: (row) => money(row.amount) },
          ]}
        />
      )}
      {!loading && section === 'profit' && (
        <DataTable rows={profitRows} rowKey={(row) => row.project} empty="No projects" columns={[
          { key: 'project', header: 'Project', cell: (row) => row.project },
          { key: 'price', header: 'Job price', cell: (row) => money(row.price) },
          { key: 'materials', header: 'Materials', cell: (row) => money(row.materials) },
          { key: 'labour', header: 'Labour', cell: (row) => money(row.labour) },
          { key: 'profit', header: 'Profit on price', cell: (row) => money(row.profit) },
        ]} />
      )}
      {!loading && section === 'stock' && (
        <DataTable rows={movementRows} rowKey={(row) => row.id} empty="No stock movements" columns={[
          { key: 'date', header: 'Date', cell: (row) => formatDate(row.created_at) },
          { key: 'name', header: 'Material', cell: (row) => row.inventory_items?.name },
          { key: 'type', header: 'Type', cell: (row) => row.movement_type },
          { key: 'qty', header: 'Quantity', cell: (row) => num(row.quantity) },
        ]} />
      )}
      {!loading && section === 'outstanding' && (
        <DataTable rows={outstanding} rowKey={(row) => row.order} empty="No outstanding balances in the loaded payments" columns={[
          { key: 'order', header: 'Order', cell: (row) => row.order },
          { key: 'customer', header: 'Customer', cell: (row) => row.customer },
          { key: 'balance', header: 'Balance', cell: (row) => money(row.balance) },
        ]} />
      )}
      {!loading && section === 'completed' && (
        <DataTable rows={completed} rowKey={(row) => row.id} empty="No projects completed in this period" columns={[
          { key: 'no', header: 'Project', cell: (row) => row.project_number },
          { key: 'who', header: 'Customer', cell: (row) => row.customers?.full_name },
          { key: 'date', header: 'Completed', cell: (row) => formatDate(row.completed_at) },
        ]} />
      )}
      <p className="mt-4 text-xs text-muted">
        Income categories include {INCOME_CATEGORIES.map(([, label]) => label).join(', ')}. Outstanding balances use every recorded payment, not only the selected dates.
      </p>
    </div>
  )
}
