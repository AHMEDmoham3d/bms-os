import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await authLogin(username, password);
      if (success) {
        window.location.reload();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl p-10 overflow-hidden relative">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600"></div>
          
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-slate-800/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 leading-tight">
              BMC OS
            </h1>
            <p className="text-lg text-slate-600 font-semibold">
              Advanced Enterprise Operating System
            </p>
          </div>

          {/* Smart Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Username
              </label>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-900 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-4 ring-slate-100/50 focus:outline-none rounded-2xl text-lg font-bold text-slate-900 placeholder-slate-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-xl backdrop-blur-sm h-14"
                  placeholder="ahmrd"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-900 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-4 ring-slate-100/50 focus:outline-none rounded-2xl text-lg font-bold text-slate-900 placeholder-slate-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-xl backdrop-blur-sm h-14"
                  placeholder="ahmed"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl shadow-sm backdrop-blur-sm text-rose-900 text-sm font-bold flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-slate-900/20 backdrop-blur-xl group relative overflow-hidden"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Access System
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -skew-x-6 -translate-x-8 group-hover:translate-x-0 duration-500" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500 font-medium">
              BMC OS © 2024 • Advanced Enterprise Operations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

