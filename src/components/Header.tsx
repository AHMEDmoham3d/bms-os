import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Folder, Users, BarChart3, Layers } from 'lucide-react';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/notes', label: 'Notes', icon: LayoutDashboard },
    { to: '/workspaces', label: 'Workspaces', icon: Layers },
    { to: '/sectors', label: 'Sectors', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Folder },
    { to: '/team', label: 'Team', icon: Users },
    { to: '/projections', label: 'Projections', icon: BarChart3 },
  ];

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group" data-discover="true">
            <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-slate-800/50">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11a9.94 9.94 0 0 1 9-11V7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight">BMC</h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Build. Manage. Connect. Operating System</p>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 border border-transparent hover:bg-slate-50 hover:shadow-md hover:border-slate-200 hover:-translate-y-px text-slate-700 hover:text-slate-900 ${
                    isActive ? 'bg-slate-900 text-white shadow-lg border-slate-800 !translate-y-0 font-bold' : ''
                  }`
                }
                data-discover="true"
              >
                <Icon className="lucide lucide-[icon-name] w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-xl hover:bg-slate-100 transition-all group"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            <nav className="flex flex-col items-start gap-2 pt-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 border border-transparent hover:bg-slate-50 hover:shadow-md hover:border-slate-200 hover:-translate-y-px text-slate-700 hover:text-slate-900 ${
                      isActive ? 'bg-slate-900 text-white shadow-lg border-slate-800 font-bold' : ''
                    }`
                  }
                  onClick={toggleMobileMenu}
                  data-discover="true"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

