
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/notes', label: 'Notes' },
    { to: '/sectors', label: 'Sectors' },
    { to: '/products', label: 'Products' },
    { to: '/team', label: 'Team' },
    { to: '/projections', label: 'Projections' },
  ];

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
<NavLink to="/" className="flex items-center gap-3 p-1 -m-1 rounded-xl hover:bg-white/50 transition-all group">
            <img 
              src="/logo.svg" 
              alt="BMC OS" 
              className="h-10 w-auto lg:h-12 drop-shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
              loading="lazy"
            />
            <span className="font-black text-xl lg:text-2xl bg-gradient-to-r from-slate-900 to-gray-900 bg-clip-text text-transparent drop-shadow-lg hidden lg:inline hover:scale-105 transition-transform">BMC OS</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => 
                  `px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-slate-900 to-gray-900 text-white shadow-lg shadow-slate-900/25 translate-y-0'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 bg-white/50 backdrop-blur-sm border border-slate-200/50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200">
            <nav className="flex flex-col items-start gap-2 pt-4">
              {navItems.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => 
                    `w-full px-4 py-3 rounded-xl font-semibold text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-slate-900 to-gray-900 text-white shadow-xl'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:shadow-lg hover:translate-x-1'
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  {label}
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

