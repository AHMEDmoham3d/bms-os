import { useState } from 'react';
import { Menu, Home, FileText, Layers, Users, TrendingUp, Settings, Search, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [hovered, setHovered] = useState('');

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/', color: 'text-blue-600' },
    { icon: FileText, label: 'Notes', path: '/notes', color: 'text-emerald-600' },
    { icon: Layers, label: 'Sectors', path: '/sectors', color: 'text-purple-600' },
    { icon: Users, label: 'Team', path: '/team', color: 'text-orange-600' },
    { icon: TrendingUp, label: 'Projections', path: '/projections', color: 'text-indigo-600' },
    { icon: Zap, label: 'Operations', path: '/ops', color: 'text-rose-600' },
    { icon: Search, label: 'Quick Search', path: '#', color: 'text-slate-600' },
    { icon: Settings, label: 'Settings', path: '/settings', color: 'text-slate-600' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 lg:w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-2xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out h-full overflow-y-auto`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
              <Menu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-900 leading-tight">BMC OS</h2>
              <p className="text-sm text-slate-600 font-medium">Operations Hub</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden mt-4 p-2 hover:bg-slate-200 rounded-xl transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(({ icon: Icon, label, path, color }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl scale-[1.02]' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:shadow-lg hover:-translate-x-1 hover:scale-[1.02]'
                }`}
                onMouseEnter={() => setHovered(label)}
                onMouseLeave={() => setHovered('')}
              >
                <Icon className={`w-6 h-6 ${color} flex-shrink-0 transition-all group-hover:scale-110`} />
                <span className="font-semibold text-sm tracking-tight">{label}</span>
                {hovered === label && !isActive && (
                  <div className="absolute right-4 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                )}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse -skew-x-12 -translate-x-8 group-hover:translate-x-0 transition-transform duration-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 pt-0">
          <div className="p-4 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-200/30 rounded-2xl backdrop-blur-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium">New Note</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <Zap className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium">New Task</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <Layers className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
