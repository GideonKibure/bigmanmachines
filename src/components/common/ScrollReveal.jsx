import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BLOCK = 'article, form, .lift-card, .rounded-lg.border, .rounded-lg.bg-accent'

function isFixed(node) {
  const position = getComputedStyle(node).position
  return position === 'absolute' || position === 'fixed'
}

function blocksIn(root) {
  const all = [...root.querySelectorAll(BLOCK)].filter((node) => !node.closest('[data-scroll-ignore]') && !node.classList.contains('rise'))
  return all.filter((node) => !all.some((other) => other !== node && other.contains(node)))
}

function targetsIn(root) {
  const blocks = blocksIn(root)
  const inside = (node) => blocks.some((block) => block.contains(node))
  const text = [...root.querySelectorAll('h1, h2, h3, p, li')].filter((node) => {
    if (node.classList.contains('rise') || node.closest('[data-scroll-ignore]')) return false
    if (inside(node) || isFixed(node)) return false
    return true
  })
  const pictures = [...root.querySelectorAll('img')].filter((node) => {
    if (inside(node) || isFixed(node) || node.closest('[data-scroll-ignore]')) return false
    return !node.parentElement?.classList.contains('relative')
  })
  const frames = [...root.querySelectorAll('.relative')].filter((node) => {
    if (inside(node) || node.closest('[data-scroll-ignore]')) return false
    return Boolean(node.querySelector(':scope > img'))
  })
  return [...blocks, ...text, ...pictures, ...frames]
}

export default function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const roots = [...document.querySelectorAll('[data-scroll-root]')]
    if (!roots.length) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = new Set()

    function finish(event) {
      if (event.target !== event.currentTarget) return
      event.currentTarget.classList.add('is-shown')
      event.currentTarget.removeEventListener('animationend', finish)
    }

    const observer = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add('is-in')
              observer.unobserve(entry.target)
            })
          },
          { threshold: 0.01, rootMargin: '0px 0px -24px 0px' },
        )

    function scan() {
      const fresh = []
      roots.forEach((root) => {
        targetsIn(root).forEach((node) => {
          if (seen.has(node)) return
          seen.add(node)
          fresh.push(node)
        })
      })
      if (!fresh.length || reduce) return
      const bands = new Map()
      fresh.forEach((node) => {
        const key = Math.round(node.getBoundingClientRect().top / 110)
        const count = bands.get(key) || 0
        bands.set(key, count + 1)
        node.classList.add('scroll-in')
        node.style.setProperty('--reveal-delay', `${Math.min(count, 6) * 80}ms`)
        node.addEventListener('animationend', finish)
        observer.observe(node)
      })
    }

    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(scan)
    }
    const mutations = new MutationObserver(schedule)
    roots.forEach((root) => mutations.observe(root, { childList: true, subtree: true }))
    schedule()

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
