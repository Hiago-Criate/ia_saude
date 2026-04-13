import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ScrollText,
  GitBranch,
  Users,
  ShoppingBag,
  Map,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/logs', label: 'Logs', icon: ScrollText },
  { to: '/workflow', label: 'Workflow', icon: GitBranch },
  { to: '/users', label: 'Usuários', icon: Users },
  { to: '/quotes', label: 'Cotações', icon: ShoppingBag },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-52 bg-gray-900 border-r border-gray-800 flex flex-col z-10">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">V</div>
          <div>
            <div className="text-white font-semibold text-sm">Vita</div>
            <div className="text-gray-500 text-xs">Admin Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-600">
        vita-core v0.1.0
      </div>
    </aside>
  )
}
