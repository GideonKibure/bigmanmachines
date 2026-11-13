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
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, labelOf, STOCK_MOVEMENTS } from '../../utils/labels'

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
      Type: labelOf(STOCK_MOVEMENTS, row.movement_type),
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
        title="Ripoti"
        text="Nambari zinatoka kwenye miamala, oda, na mienendo ya stoo iliyohifadhiwa."
        action={
          <span className="no-print flex gap-2">
            <Button type="button" variant="surface" onClick={() => window.print()}>Chapisha</Button>
            <Button type="button" variant="surface" onClick={() => downloadCsv(`${section}-${from}.csv`, sections[section])}>Pakua CSV</Button>
          </span>
        }
      />
      <div className="no-print mb-4 flex flex-wrap gap-3">
        <Field label="Kuanzia"><input className={inputClass} type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></Field>
        <Field label="Hadi"><input className={inputClass} type="date" value={to} onChange={(event) => setTo(event.target.value)} /></Field>
      </div>
      <div className="no-print mb-4 flex flex-wrap gap-2">
        {[
          ['sales', 'Mauzo ya kila siku'],
          ['expenses', 'Matumizi'],
          ['profit', 'Faida ya mradi'],
          ['stock', 'Mienendo ya stoo'],
          ['outstanding', 'Outstanding'],
          ['completed', 'Miradi iliyokamilika'],
        ].map(([key, label]) => (
          <Button key={key} type="button" variant={section === key ? 'primary' : 'surface'} onClick={() => setSection(key)}>{label}</Button>
        ))}
      </div>
      {loading && <Spinner />}
      {error && <p className="text-sm text-red-700">{errorText(error)}</p>}
      {!loading && section === 'sales' && (
        <DataTable rows={sales} rowKey={(row) => row.date} empty="Hakuna mauzo katika kipindi hiki" columns={[
          { key: 'date', header: 'Tarehe', cell: (row) => formatDate(row.date) },
          { key: 'amount', header: 'Pesa iliyopokelewa', cell: (row) => money(row.amount) },
        ]} />
      )}
      {!loading && section === 'expenses' && (
        <DataTable
          rows={inRange.filter((row) => row.type === 'expense')}
          rowKey={(row) => row.id}
          empty="Hakuna matumizi katika kipindi hiki"
          columns={[
            { key: 'date', header: 'Tarehe', cell: (row) => formatDate(row.transaction_date) },
            { key: 'category', header: 'Kundi', cell: (row) => labelOf(EXPENSE_CATEGORIES, row.category) },
            { key: 'amount', header: 'Kiasi', cell: (row) => money(row.amount) },
          ]}
        />
      )}
      {!loading && section === 'profit' && (
        <DataTable rows={profitRows} rowKey={(row) => row.project} empty="Hakuna miradi" columns={[
          { key: 'project', header: 'Mradi', cell: (row) => row.project },
          { key: 'price', header: 'Bei ya kazi', cell: (row) => money(row.price) },
          { key: 'materials', header: 'Vifaa', cell: (row) => money(row.materials) },
          { key: 'labour', header: 'Kazi', cell: (row) => money(row.labour) },
          { key: 'profit', header: 'Faida juu ya bei', cell: (row) => money(row.profit) },
        ]} />
      )}
      {!loading && section === 'stock' && (
        <DataTable rows={movementRows} rowKey={(row) => row.id} empty="Hakuna mienendo ya stoo" columns={[
          { key: 'date', header: 'Tarehe', cell: (row) => formatDate(row.created_at) },
          { key: 'name', header: 'Kifaa', cell: (row) => row.inventory_items?.name },
          { key: 'type', header: 'Aina', cell: (row) => labelOf(STOCK_MOVEMENTS, row.movement_type) },
          { key: 'qty', header: 'Idadi', cell: (row) => num(row.quantity) },
        ]} />
      )}
      {!loading && section === 'outstanding' && (
        <DataTable rows={outstanding} rowKey={(row) => row.order} empty="Hakuna deni katika malipo yaliyopakiwa" columns={[
          { key: 'order', header: 'Oda', cell: (row) => row.order },
          { key: 'customer', header: 'Mteja', cell: (row) => row.customer },
          { key: 'balance', header: 'Salio', cell: (row) => money(row.balance) },
        ]} />
      )}
      {!loading && section === 'completed' && (
        <DataTable rows={completed} rowKey={(row) => row.id} empty="Hakuna miradi iliyokamilika katika kipindi hiki" columns={[
          { key: 'no', header: 'Mradi', cell: (row) => row.project_number },
          { key: 'who', header: 'Mteja', cell: (row) => row.customers?.full_name },
          { key: 'date', header: 'Imekamilika', cell: (row) => formatDate(row.completed_at) },
        ]} />
      )}
      <p className="mt-4 text-xs text-muted">
        Makundi ya mapato ni pamoja na {INCOME_CATEGORIES.map(([, label]) => label).join(', ')}. Deni hutumia kila malipo yaliyoandikwa, si tarehe zilizochaguliwa pekee.
      </p>
    </div>
  )
}
