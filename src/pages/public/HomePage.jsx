import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { buttonClass } from '../../components/common/Button'
import SectionHeading from '../../components/common/SectionHeading'
import Spinner from '../../components/common/Spinner'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSettings } from '../../contexts/SettingsContext'
import { useLoad } from '../../hooks/useLoad'
import { mediaUrl } from '../../lib/media'
import { listPortfolio, listProducts, listServices } from '../../services/catalog'
import { formatMoney, whatsappLink } from '../../utils/format'
import { labelOf, AVAILABILITY } from '../../utils/labels'
import { localizeProduct, localizeProject, localizeService } from '../../utils/swahili'

function HeroWords({ headline, highlight }) {
  const lead = String(headline || '').trim().split(/\s+/).filter(Boolean)
  const accent = String(highlight || '').trim().split(/\s+/).filter(Boolean)
  const words = [...lead, ...accent]
  return words.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className={`hero-word${index >= lead.length ? ' text-accent' : ''}`}
      style={{ '--i': index }}
    >
      {word}
    </span>
  ))
}

const process = [
  { title: 'Pima', text: 'Tunapima uwazi mahali pa kazi ili fremu iingie mara ya kwanza.' },
  { title: 'Kadiria', text: 'Vifaa, kazi, usafiri, na faida huandikwa kabla ya chuma kukatiwa.' },
  { title: 'Tengeneza', text: 'Kukata, kulehemu, kusaga, na rangi hubaki kwa timu ile ile.' },
  { title: 'Malizia', text: 'Kazi hukaguliwa, kusafishwa, na kuwa tayari kuwekwa kabla ya kutoka.' },
]

export default function HomePage() {
  const { settings } = useSettings()
  const { lang } = useLanguage()
  const { data, loading } = useLoad(
    () => Promise.all([listServices(), listProducts(), listPortfolio()]).then(([services, products, projects]) => ({ services, products, projects })),
    [],
  )
  const [stage, setStage] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)

  const services = (data?.services || []).map((item) => localizeService(item, lang)).filter((item) => item.is_featured).slice(0, 3)
  const projects = (data?.projects || []).map((item) => localizeProject(item, lang)).filter((item) => item.is_featured).slice(0, 3)
  const products = (data?.products || []).map((item) => localizeProduct(item, lang)).filter((item) => item.is_featured).slice(0, 3)
  const testimonials = (settings.testimonials || []).filter((item) => item.quote)
  const testimonial = testimonials[quoteIndex] || testimonials[0]
  const whatsapp = whatsappLink(settings.whatsapp || settings.phone)
  const current = process[stage]

  return (
    <>
      <section className="relative min-h-[88vh]">
        <img
          src={mediaUrl(settings.hero_image_url)}
          alt="Fundi akifanya kazi karakani"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl items-center px-5 py-28">
          <div className="max-w-2xl">
            <p className="rise text-xs font-semibold uppercase tracking-[0.22em] text-accent">{settings.hero_eyebrow}</p>
            <h1 className="hero-line rise mt-4 font-display text-5xl uppercase leading-[0.92] text-white md:text-7xl">
              <HeroWords headline={settings.hero_headline} highlight={settings.hero_highlight} />
            </h1>
            <p className="rise mt-5 max-w-xl text-base text-zinc-300 md:text-lg" style={{ animationDelay: '160ms' }}>{settings.hero_subtext}</p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
              <Link to="/quote" className={buttonClass('primary')}>Omba bei</Link>
              <Link to="/services" className={buttonClass('ghost')}>Angalia huduma</Link>
            </div>
          </div>
        </div>
        <a href="#workshop" className="scroll-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 sm:block">
          <span className="mx-auto mb-2 block h-2 w-2 rounded-full bg-accent" />
          Sogeza chini
        </a>
      </section>

      <section id="workshop" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Karakana" title="Mahali chuma kinakamilika" />
          <p className="mt-5 text-muted">{settings.about}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <article className="lift-card rounded-lg border border-line bg-card p-4">
              <p className="font-display text-3xl text-accent">{settings.stat_years}</p>
              <p className="text-xs uppercase tracking-wide text-muted">Miaka kazini</p>
            </article>
            <article className="lift-card rounded-lg border border-line bg-card p-4">
              <p className="font-display text-3xl text-accent">{settings.stat_projects}</p>
              <p className="text-xs uppercase tracking-wide text-muted">Kazi zilizokamilika</p>
            </article>
          </div>
        </div>
        <div className="relative">
          <img src={mediaUrl(settings.about_image_url)} alt="Fundi kwenye benchi" className="h-[420px] w-full rounded-lg object-cover" />
          <div className="absolute bottom-4 left-4 max-w-[180px] rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white">
            Imepimwa, kulehemu, na kukaguliwa kabla ya kutoka.
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="Tunachofanya" title="Huduma zetu" text="Milango, fremu, fanicha, miundo, na matengenezo." />
          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {services.map((service) => (
                <article key={service.id} className="lift-card media-card h-full rounded-lg border border-line bg-card">
                    <img src={mediaUrl(service.image_url)} alt="" className="h-48 w-full object-cover" />
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{service.category}</p>
                      <h3 className="mt-2 font-display text-2xl uppercase">{service.name}</h3>
                      <ul className="mt-3 space-y-1 text-sm text-muted">
                        {(service.highlights || []).slice(0, 3).map((point) => (
                          <li key={point}>• {point}</li>
                        ))}
                      </ul>
                      <Link to={`/quote?service=${encodeURIComponent(service.name)}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                        Omba bei <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-20 lg:grid-cols-5">
        <div className="rounded-lg border border-line bg-card p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Jinsi tunavyofanya</p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-none">{settings.feature_title}</h2>
          <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Hatua za karakana">
            {process.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={stage === index}
                onClick={() => setStage(index)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${stage === index ? 'bg-accent text-white' : 'border border-line text-muted hover:border-accent hover:text-ink'}`}
              >
                {index + 1}. {item.title}
              </button>
            ))}
          </div>
          <p key={current.title} className="rise mt-4 text-sm text-muted">{current.text}</p>
        </div>
        <img src={mediaUrl(settings.feature_image_url)} alt="Muonekano wa karibu wa kulehemu" className="h-72 w-full rounded-lg object-cover lg:col-span-2 lg:h-full" />
        <div className="flex flex-col justify-between rounded-lg bg-accent p-6 text-white lg:col-span-1">
          <div>
            <h2 className="font-display text-3xl uppercase leading-none">{settings.callout_title}</h2>
            <p className="mt-3 text-sm text-white/90">{settings.callout_text}</p>
          </div>
          <Link to="/quote" className="group mt-6 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide">
            Omba bei <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Kazi za hivi karibuni" title="Miradi iliyokamilika" />
            <Link to="/projects" className="group inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Angalia kazi <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} to="/projects" className="lift-card media-card block rounded-lg border border-line bg-card">
                <img src={mediaUrl(project.cover_image_url)} alt="" className="h-52 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-accent">{project.category}</p>
                  <h3 className="mt-2 font-display text-2xl uppercase">{project.title}</h3>
                  <p className="mt-2 text-sm text-muted">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="Kutoka dukani" title="Bidhaa maalum" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="lift-card media-card rounded-lg border border-line bg-card p-5">
              <img src={mediaUrl(product.image_url)} alt="" className="h-44 w-full rounded-md object-cover" />
              <h3 className="mt-4 font-display text-2xl uppercase">{product.name}</h3>
              <p className="mt-2 text-sm text-muted">{product.description}</p>
              <p className="mt-3 font-semibold">{product.price ? formatMoney(product.price, settings.currency_code) : 'Bei kwa maombi'}</p>
              <p className="text-xs uppercase tracking-wide text-muted">{labelOf(AVAILABILITY, product.availability)}</p>
              <Link to={`/quote?product=${encodeURIComponent(product.name)}`} className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Omba oda <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="Kwa nini utuchague" title="Sababu za kweli" />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {(settings.why_choose || []).map((item, index) => (
              <article key={item.title} className="lift-card rounded-lg border border-line bg-card p-5">
                <p className="font-display text-3xl text-accent">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-display text-xl uppercase">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-steel text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Karakana</p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-none">Zungumza nasi kabla ya kuagiza chuma</h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-200">
            {settings.phone ? (
              <a className="flex items-center gap-2 rounded-md transition hover:bg-white/10 hover:text-white" href={`tel:${settings.phone}`}><Phone size={16} /> {settings.phone}</a>
            ) : (
              <p>Nambari ya simu itaonekana hapa baada ya kuhifadhiwa kwenye mipangilio.</p>
            )}
            {whatsapp && <a className="inline-block font-semibold text-accent" href={whatsapp} target="_blank" rel="noreferrer">WhatsApp karakana</a>}
            {settings.email && (
              <a className="flex items-center gap-2 rounded-md transition hover:bg-white/10 hover:text-white" href={`mailto:${settings.email}`}><Mail size={16} /> {settings.email}</a>
            )}
          </div>
          <div className="text-sm text-zinc-200">
            {settings.address ? (
              <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5" /> {settings.address}</p>
            ) : (
              <p>Mahali pa karakana huongezwa kutoka mipangilio.</p>
            )}
            <ul className="mt-4 space-y-1">
              {(settings.hours || []).map((row) => (
                <li key={row.days} className="flex justify-between gap-4">
                  <span>{row.days}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {testimonial && (
        <section className="mx-auto max-w-3xl px-5 py-20 text-center">
          <p key={testimonial.name} className="rise text-xl leading-relaxed text-paper">“{testimonial.quote}”</p>
          <p className="mt-4 font-semibold">{testimonial.name}</p>
          <p className="text-sm text-muted">{testimonial.role}</p>
          {testimonials.length > 1 && (
            <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Maoni ya wateja">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Onyesha maoni ya ${item.name}`}
                  aria-selected={quoteIndex === index}
                  onClick={() => setQuoteIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${quoteIndex === index ? 'w-8 bg-accent' : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'}`}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}
