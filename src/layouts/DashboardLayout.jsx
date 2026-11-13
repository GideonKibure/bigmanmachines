import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardLayout() {
  const { profile, role, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface text-ink lg:flex">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="no-print flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:px-6">
          <button type="button" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Fungua menyu">
            <Menu />
          </button>
          <p className="hidden text-sm text-muted lg:block">
            {profile?.full_name || 'Karakana'} · {role === 'admin' ? 'Msimamizi' : 'Mfanyakazi'}
          </p>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link to="/" className="text-muted hover:text-ink">
              Angalia tovuti
            </Link>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-1 text-muted hover:text-ink">
              <LogOut size={15} /> Toka
            </button>
          </div>
        </header>
        <div className="px-4 py-6 lg:px-8" data-scroll-root>
          {!profile && (
            <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Akaunti hii haina wasifu. Endesha SQL ya hifadhidata, kisha ingia tena.
            </p>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
