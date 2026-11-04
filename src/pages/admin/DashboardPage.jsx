import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../contexts/AuthContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { getDashboard } from '../../services/finance'
import { listProjects } from '../../services/projects'
import { errorText, formatMoney, num } from '../../utils/format'
import { ORDER_STATUSES, PROJECT_STATUSES, REQUEST_STATUSES } from '../../utils/labels'

function Card({ label, value, note }) {
  return (
    <article className="lift-card rounded-lg border border-line bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-paper">{value}</p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </article>
  )
}

function AdminHome() {
  const { settings } = useSettings()
  const { data, loading, error } = useLoad(() => getDashboard(), [])
  const money = (value) => formatMoney(value, settings.currency_code)

  if (loading) return <Spinner />
  if (error) return <EmptyState title="Could not load the dashboard" text={errorText(error)} />

  const monthly = (data.monthly || []).map((row) => ({
    ...row,
    revenue: num(row.revenue),
    expenses: num(row.expenses),
  }))

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Workshop today" text="Cash received is money already in. Agreed orders are the contract value, including amounts customers still owe." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Cash received" value={money(data.total_revenue)} />
        <Card label="Expenses" value={money(data.total_expenses)} />
        <Card label="Cash profit" value={money(data.estimated_profit)} note="Income minus expenses" />
        <Card label="Outstanding" value={money(data.outstanding_payments)} note="Still owed on orders" />
        <Card label="Agreed orders" value={money(data.agreed_value)} note="Contract value, not cash" />
        <Card label="Pending quotations" value={data.pending_quotations} />
        <Card label="Orders" value={data.approved_orders} note="Not cancelled" />
        <Card label="Active projects" value={data.active_projects} />
        <Card label="Completed projects" value={data.completed_projects} />
        <Card label="Low stock" value={data.low_stock} />
      </div>

      <section className="mt-8 rounded-lg border border-line bg-card p-4">
        <h2 className="font-display text-2xl uppercase">Monthly cash</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="month" stroke="#525252" fontSize={12} />
              <YAxis stroke="#525252" fontSize={12} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e5e5', color: '#171717' }} />
              <Bar dataKey="revenue" name="Cash in" fill="#f97316" />
              <Bar dataKey="expenses" name="Expenses" fill="#334155" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Recent orders</h2>
          <div className="mt-3 space-y-3">
            {(data.recent_orders || []).map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="block font-medium">{order.order_number}</span>
                  <span className="text-muted">{order.customer_name}</span>
                </span>
                <StatusBadge status={order.status} list={ORDER_STATUSES} />
              </Link>
            ))}
            {!data.recent_orders?.length && <p className="text-sm text-muted">No orders yet.</p>}
          </div>
        </section>
        <section className="rounded-lg border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Quotation requests</h2>
          <div className="mt-3 space-y-3">
            {(data.recent_requests || []).map((request) => (
              <Link key={request.id} to={`/admin/requests/${request.id}`} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="block font-medium">{request.reference_number}</span>
                  <span className="text-muted">{request.customer_name} · {request.project_title}</span>
                </span>
                <StatusBadge status={request.status} list={REQUEST_STATUSES} />
              </Link>
            ))}
            {!data.recent_requests?.length && <p className="text-sm text-muted">No requests yet.</p>}
          </div>
        </section>
        <section className="rounded-lg border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Project progress</h2>
          <div className="mt-3 space-y-3">
            {(data.project_progress || []).map((project) => (
              <Link key={project.id} to={`/admin/projects/${project.id}`} className="block text-sm">
                <div className="flex justify-between gap-3">
                  <span>{project.project_number}</span>
                  <span>{project.progress_percent}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-zinc-200">
                  <div className="h-1.5 rounded-full bg-accent" style={{ width: `${project.progress_percent}%` }} />
                </div>
              </Link>
            ))}
            {!data.project_progress?.length && <p className="text-sm text-muted">No active projects.</p>}
          </div>
        </section>
        <section className="rounded-lg border border-line bg-card p-4">
          <h2 className="font-display text-2xl uppercase">Inventory alerts</h2>
          <div className="mt-3 space-y-2 text-sm">
            {(data.low_stock_items || []).map((item) => (
              <p key={item.id} className="flex justify-between gap-3">
                <span>{item.name}</span>
                <span className="text-red-700">{num(item.quantity_available)} / {num(item.minimum_stock)} {item.unit}</span>
              </p>
            ))}
            {!data.low_stock_items?.length && <p className="text-muted">Stock is above the minimum levels.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}

function EmployeeHome() {
  const { data, loading, error } = useLoad(() => listProjects(), [])
  if (loading) return <Spinner />
  if (error) return <EmptyState title="Could not load your jobs" text={errorText(error)} />
  return (
    <div>
      <PageHeader title="Your jobs" text="Update the stage when the work moves forward, and record material you use." />
      <div className="grid gap-3">
        {(data || []).map((project) => (
          <Link key={project.id} to={`/admin/projects/${project.id}`} className="rounded-lg border border-line bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{project.project_number}</p>
                <p className="text-sm text-muted">{project.customers?.full_name}</p>
              </div>
              <StatusBadge status={project.status} list={PROJECT_STATUSES} />
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-zinc-200">
              <div className="h-1.5 rounded-full bg-accent" style={{ width: `${project.progress_percent}%` }} />
            </div>
          </Link>
        ))}
        {!data?.length && <EmptyState title="No jobs assigned yet" text="An administrator assigns work from the project page." />}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { role } = useAuth()
  if (role !== 'admin') return <EmployeeHome />
  return <AdminHome />
}
