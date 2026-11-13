import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { mediaUrl } from '../../lib/media'
import { listProducts } from '../../services/catalog'
import { errorText, formatMoney } from '../../utils/format'
import { AVAILABILITY, labelOf } from '../../utils/labels'
import { localizeProduct } from '../../utils/swahili'

export default function ProductsPage() {
  const { settings } = useSettings()
  const { lang } = useLanguage()
  const { data, loading, error } = useLoad(() => listProducts(), [])
  const products = (data || []).map((item) => localizeProduct(item, lang))

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <PageHeader eyebrow="Bidhaa" title="Kazi za chuma zilizo tayari" text="Bei ni makadirio hadi tutakapothibitisha ukubwa." />
      {loading && <Spinner />}
      {error && <EmptyState title="Bidhaa hazikuweza kupakiwa" text={errorText(error)} />}
      <div className="grid gap-5 md:grid-cols-2">
        {products.map((product) => (
          <article key={product.id} className="lift-card media-card rounded-lg border border-line bg-card md:grid md:grid-cols-2">
            <img src={mediaUrl(product.image_url)} alt="" className="h-56 w-full object-cover md:h-full" />
            <div className="p-5">
              <h2 className="font-display text-3xl uppercase">{product.name}</h2>
              <p className="mt-2 text-sm text-muted">{product.description}</p>
              <p className="mt-3 text-lg font-semibold">
                {product.price ? formatMoney(product.price, settings.currency_code) : 'Bei kwa maombi'}
              </p>
              <p className="text-xs uppercase tracking-wide text-accent">{labelOf(AVAILABILITY, product.availability)}</p>
              <dl className="mt-3 space-y-1 text-sm text-muted">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-3">
                    <dt>{key}</dt>
                    <dd className="text-paper">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link to={`/quote?product=${encodeURIComponent(product.name)}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Omba oda <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
