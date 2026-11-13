import { NavLink } from 'react-router-dom'
import {
  ChartColumn,
  ClipboardList,
  FileText,
  Globe,
  Hammer,
  HardHat,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Wallet,
  X,
} from 'lucide-react'

export const navLinks = [
  { to: '/admin', label: 'Muhtasari', icon: LayoutDashboard, end: true, roles: ['admin', 'employee'] },
  { to: '/admin/customers', label: 'Wateja', icon: Users, roles: ['admin'] },
  { to: '/admin/quotations', label: 'Makadirio', icon: FileText, roles: ['admin'] },
  { to: '/admin/orders', label: 'Oda', icon: ClipboardList, roles: ['admin'] },
  { to: '/admin/projects', label: 'Miradi', icon: Hammer, roles: ['admin', 'employee'] },
  { to: '/admin/inventory', label: 'Hifadhi', icon: Package, roles: ['admin', 'employee'] },
  { to: '/admin/finance', label: 'Fedha', icon: Wallet, roles: ['admin'] },
  { to: '/admin/reports', label: 'Ripoti', icon: ChartColumn, roles: ['admin'] },
  { to: '/admin/catalog', label: 'Tovuti', icon: Globe, roles: ['admin'] },
  { to: '/admin/employees', label: 'Timu', icon: HardHat, roles: ['admin'] },
  { to: '/admin/settings', label: 'Mipangilio', icon: Settings, roles: ['admin'] },
]

export default function Sidebar({ role, open, onClose }) {
  const links = navLinks.filter((link) => link.roles.includes(role))

  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} aria-label="Funga menyu" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-ink text-white transition lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <NavLink to="/" className="font-display text-xl uppercase tracking-wide text-white">
            Karakana
          </NavLink>
          <button type="button" className="text-zinc-400 lg:hidden" onClick={onClose} aria-label="Funga">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-accent text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
