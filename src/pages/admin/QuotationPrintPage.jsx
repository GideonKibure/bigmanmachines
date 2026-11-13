import { Link, useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { getQuotation } from '../../services/quotes'
import { errorText, formatDate, formatMoney } from '../../utils/format'

export default function QuotationPrintPage() {
  const { id } = useParams()
  const { settings } = useSettings()
  const { data, loading, error } = useLoad(() => getQuotation(id), [id])

  if (loading) return <Spinner />
  if (error) return <EmptyState title="Makadirio haya hayakufunguka" text={errorText(error)} />

  const money = (value) => formatMoney(value, settings.currency_code)

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-zinc-900">
      <div className="no-print mb-6 flex gap-3">
        <button type="button" onClick={() => window.print()} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white">Chapisha</button>
        <Link to={`/admin/quotations/${id}`} className="rounded-md border px-4 py-2 text-sm">Rudi</Link>
      </div>
      <header className="flex items-start justify-between gap-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold uppercase">{settings.business_name}</h1>
          <p className="text-sm">{settings.phone}</p>
          <p className="text-sm">{settings.email}</p>
          <p className="text-sm">{settings.address}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-lg font-semibold">{data.quotation_number}</p>
          <p>Date {formatDate(data.created_at)}</p>
          <p>Inatumika hadi {formatDate(data.valid_until)}</p>
        </div>
      </header>
      <section className="mt-6 text-sm">
        <p className="font-semibold">{data.customers?.full_name}</p>
        <p>{data.customers?.phone}</p>
        <p>{data.customers?.location}</p>
      </section>
      <h2 className="mt-6 text-xl font-semibold">{data.title}</h2>
      {data.description && <p className="mt-2 max-w-2xl text-sm">{data.description}</p>}
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Maelezo</th>
            <th>Idadi</th>
            <th>Kipimo</th>
            <th className="text-right">Kiasi</th>
          </tr>
        </thead>
        <tbody>
          {(data.quotation_items || []).map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.description}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td className="text-right">{money(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right text-xl font-bold">Kiasi kinachotakiwa {money(data.total)}</p>
      <p className="mt-10 text-sm">Makadirio haya ni ya kazi iliyoelezwa hapo juu. Kazi huanza baada ya kuyakubali.</p>
    </div>
  )
}
