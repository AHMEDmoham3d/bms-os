import { useState, useEffect } from 'react';

const VALID_USERNAME = 'ahmrd';
const VALID_PASSWORD = 'ahmed';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear login on refresh
    sessionStorage.removeItem('bmc-logged-in');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Static login success - store in session/localStorage
        sessionStorage.setItem('bmc-logged-in', 'true');
        // Reload to trigger App logic
        window.location.reload();
      } else {
        setError('اسم المستخدم أو كلمة السر غير صحيحة');
      }
    }, 800);
  };

  const isLoggedIn = sessionStorage.getItem('bmc-logged-in') === 'true';

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-emerald-600 mx-auto mb-8"></div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">جاري التحميل...</h2>
          <p className="text-slate-600">النظام يتم تحميله</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 sm:p-10 overflow-hidden relative">
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
              BMC OS
            </h1>
            <p className="text-lg text-slate-600 font-semibold max-w-sm mx-auto leading-relaxed">
              نظام التشغيل المتقدم للشركات
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                اسم المستخدم
              </label>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-semibold text-slate-900 placeholder-slate-500 focus:ring-4 ring-slate-900/20 focus:border-slate-900 focus:outline-none transition-all group-hover:border-slate-300 backdrop-blur-sm shadow-sm hover:shadow-md"
                  placeholder="ahmrd"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                كلمة المرور
              </label>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-semibold text-slate-900 placeholder-slate-500 focus:ring-4 ring-slate-900/20 focus:border-slate-900 focus:outline-none transition-all group-hover:border-slate-300 backdrop-blur-sm shadow-sm hover:shadow-md"
                  placeholder="ahmed"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-semibold shadow-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-black text-lg py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-slate-900/50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحقق...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  دخول النظام
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            BMC OS © 2024 • نظام تشغيل الشركات المتقدم
          </div>
        </div>
      </div>
    </div>
  );
}

