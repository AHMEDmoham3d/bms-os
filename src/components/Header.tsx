import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, LayoutDashboard, Folder, Users, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/notes', label: 'Notes', icon: LayoutDashboard },
  { path: '/sectors', label: 'Sectors', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Folder },
  { path: '/team', label: 'Team', icon: Users },
  { path: '/projections', label: 'Projections', icon: BarChart3 },
];

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Professional Modern Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-slate-800/50">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11a9.94 9.94 0 0 1 9-11V7z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight">BMC</h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Build. Manage. Connect. Operating System</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              const baseClass = 'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 border border-transparent hover:bg-slate-50 hover:shadow-md hover:border-slate-200 hover:-translate-y-px';
              const activeClass = isActive ? 'bg-slate-900 text-white shadow-lg border-slate-800 !translate-y-0 font-bold' : 'text-slate-700 hover:text-slate-900';
              return (
                <Link
                  key={path}
                  to={path}
                  className={`${baseClass} ${activeClass}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button 
              className="p-2 rounded-xl hover:bg-slate-100 transition-all group relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl z-50 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex flex-col gap-1">
                {navItems.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center gap-3 p-4 rounded-xl font-semibold transition-all border border-transparent hover:bg-slate-50 hover:shadow-md hover:border-slate-200 hover:-translate-y-px group ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-lg border-slate-800 font-bold' 
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
