import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useSettings } from '../contexts/SettingsContext'

export default function PublicLayout() {
  const { configured } = useSettings()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-canvas pb-20 text-ink lg:pb-0">
      {!configured && (
        <div className="bg-accent px-4 py-2 text-center text-sm font-semibold text-white">
          Preview mode. Add Supabase keys in .env.local to save quotes and open the workshop dashboard.
        </div>
      )}
      <Navbar />
      <div data-scroll-root>
        <Outlet />
      </div>
      <Footer />
      {pathname !== '/quote' && (
        <Link to="/quote" className="fixed right-4 bottom-4 z-30 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-dark lg:hidden">
          Get a quote
        </Link>
      )}
    </div>
  )
}
