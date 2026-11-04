import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { buttonClass } from '../../components/common/Button'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StatusBadge from '../../components/common/StatusBadge'
import { useLoad } from '../../hooks/useLoad'
import { signedUrl } from '../../lib/media'
import { saveCustomer } from '../../services/customers'
import { getRequest, updateRequest } from '../../services/quotes'
import { errorText, formatDate } from '../../utils/format'
import { REQUEST_STATUSES } from '../../utils/labels'

export default function RequestDetailPage() {
  const { id } = useParams()
  const { data, loading, error, reload } = useRequest(id)
  const [image, setImage] = useState('')

  useEffect(() => {
    if (data?.image_path) {
      signedUrl('quote-uploads', data.image_path).then(setImage).catch(() => setImage(''))
    }
  }, [data])

  if (loading) return <Spinner />
  if (error) return <EmptyState title="Could not open this request" text={errorText(error)} />

  async function createCustomer() {
    try {
      const customer = await saveCustomer({
        full_name: data.customer_name,
        phone: data.phone,
        email: data.email || '',
        location: data.location || '',
        notes: `Created from ${data.reference_number}`,
      })
      await updateRequest(data.id, { customer_id: customer.id, status: 'in_review' })
      toast.success('Customer created')
      reload()
    } catch (saveError) {
      toast.error(errorText(saveError))
    }
  }

  const rows = [
    ['Phone', data.phone],
    ['Email', data.email || '—'],
    ['Type', data.fabrication_type],
    ['Quantity', data.quantity],
    ['Dimensions', data.dimensions || '—'],
    ['Materials', data.preferred_materials || '—'],
    ['Location', data.location || '—'],
    ['Preferred date', formatDate(data.preferred_completion_date)],
  ]

  return (
    <div>
      <PageHeader title={data.project_title} text={data.reference_number} action={<StatusBadge status={data.status} list={REQUEST_STATUSES} />} />
      <p className="mb-4 text-sm text-muted">{data.customer_name}</p>
      <p className="max-w-3xl text-sm leading-6 text-paper">{data.description}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md border border-line bg-card px-3 py-2">
            <dt className="text-xs uppercase text-muted">{label}</dt>
            <dd className="mt-1 text-sm">{value}</dd>
          </div>
        ))}
      </dl>
      {image && <img src={image} alt="Reference supplied by the customer" className="mt-6 max-h-80 rounded-lg object-contain" />}
      <div className="mt-6 flex flex-wrap gap-2">
        {!data.customer_id && <Button type="button" onClick={createCustomer}>Create customer from this request</Button>}
        <Link
          to={data.customer_id ? `/admin/quotations/new?request=${data.id}` : '#'}
          className={buttonClass('primary', data.customer_id ? '' : 'pointer-events-none opacity-50')}
        >
          Build quotation
        </Link>
        {data.status !== 'closed' && (
          <Button
            type="button"
            variant="surface"
            onClick={async () => {
              await updateRequest(data.id, { status: 'closed' })
              toast.success('Request closed')
              reload()
            }}
          >
            Close request
          </Button>
        )}
      </div>
    </div>
  )
}

function useRequest(id) {
  const [tick, setTick] = useState(0)
  const state = useLoad(() => getRequest(id), [id, tick])
  return { ...state, reload: () => setTick((value) => value + 1) }
}
