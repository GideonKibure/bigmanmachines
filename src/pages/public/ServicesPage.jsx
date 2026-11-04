import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import { useLoad } from '../../hooks/useLoad'
import { mediaUrl } from '../../lib/media'
import { listServices } from '../../services/catalog'
import { errorText } from '../../utils/format'

export default function ServicesPage() {
  const { data, loading, error } = useLoad(() => listServices(), [])

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <PageHeader
        eyebrow="Services"
        title="What we fabricate"
        text="Each job starts with a measurement and a written quotation."
      />
      {loading && <Spinner />}
      {error && <EmptyState title="Could not load services" text={errorText(error)} />}
      <div className="grid gap-5 md:grid-cols-2">
        {(data || []).map((service) => (
          <article key={service.id} className="lift-card media-card rounded-lg border border-line bg-card md:grid md:grid-cols-5">
            <img src={mediaUrl(service.image_url)} alt="" className="h-48 w-full object-cover md:col-span-2 md:h-full" />
            <div className="p-5 md:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{service.category}</p>
              <h2 className="mt-2 font-display text-3xl uppercase">{service.name}</h2>
              <p className="mt-2 text-sm text-muted">{service.description}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {(service.highlights || []).map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <Link to={`/quote?service=${encodeURIComponent(service.name)}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Request a quotation <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
