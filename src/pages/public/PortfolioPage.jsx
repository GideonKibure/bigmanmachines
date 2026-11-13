import { useMemo, useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import Lightbox from '../../components/common/Lightbox'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { useLanguage } from '../../contexts/LanguageContext'
import { useLoad } from '../../hooks/useLoad'
import { mediaUrl } from '../../lib/media'
import { listPortfolio } from '../../services/catalog'
import { errorText, formatDate } from '../../utils/format'
import { localizeProject } from '../../utils/swahili'

function projectImages(project) {
  const urls = [project.cover_image_url, ...(project.images || []).map((image) => image.image_url)]
  return [...new Set(urls.filter(Boolean))].map((url) => mediaUrl(url))
}

export default function PortfolioPage() {
  const { lang } = useLanguage()
  const { data, loading, error } = useLoad(() => listPortfolio(), [])
  const projects = (data || []).map((item) => localizeProject(item, lang))
  const [category, setCategory] = useState('All')
  const [viewer, setViewer] = useState(null)
  const categories = useMemo(() => ['All', ...new Set(projects.map((item) => item.category))], [projects])
  const visible = projects.filter((item) => category === 'All' || item.category === category)

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <PageHeader eyebrow="Kazi" title="Miradi iliyokamilika" text="Chuja kulingana na aina ya kazi. Fungua picha ili kuangalia karibu." />
      <div className="mb-3 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${category === item ? 'bg-accent text-white' : 'border border-line text-muted hover:border-accent hover:text-ink'}`}
          >
            {item === 'All' ? 'Zote' : item}
          </button>
        ))}
      </div>
      <p className="mb-6 text-sm text-muted">
        {visible.length} {visible.length === 1 ? 'mradi' : 'miradi'}
      </p>
      {loading && <Spinner />}
      {error && <EmptyState title="Miradi haikuweza kupakiwa" text={errorText(error)} />}
      {!loading && !visible.length && <EmptyState title="Hakuna miradi katika kundi hili" />}
      <div key={category} className="rise grid gap-5 md:grid-cols-2">
        {visible.map((project) => {
          const images = projectImages(project)
          return (
            <article key={project.id} className="lift-card media-card rounded-lg border border-line bg-card">
              <button type="button" className="block w-full text-left" onClick={() => setViewer({ title: project.title, images, index: 0 })}>
                <img src={images[0]} alt="" className="h-64 w-full object-cover" />
              </button>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-accent">{project.category}</p>
                <h2 className="mt-2 font-display text-3xl uppercase">{project.title}</h2>
                <p className="mt-2 text-sm text-muted">{project.description}</p>
                <p className="mt-3 text-sm text-paper">Ilikamilika {formatDate(project.completion_date)}</p>
                {project.materials && <p className="mt-1 text-sm text-muted">Vifaa: {project.materials}</p>}
                {images.length > 1 && (
                  <button type="button" className="mt-3 text-sm font-semibold text-accent" onClick={() => setViewer({ title: project.title, images, index: 0 })}>
                    Angalia picha {images.length}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      {viewer && (
        <Lightbox
          title={viewer.title}
          images={viewer.images}
          index={viewer.index}
          onIndex={(index) => setViewer((current) => ({ ...current, index }))}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  )
}
