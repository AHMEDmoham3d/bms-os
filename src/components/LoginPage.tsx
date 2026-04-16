import { useState } from 'react';

const VALID_USERNAME = 'ahmrd';
const VALID_PASSWORD = 'ahmed';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setIsLoggedIn(true);
        // Reload to trigger App logic
        window.location.reload();
      } else {
        setError('اسم المستخدم أو كلمة السر غير صحيحة');
      }
    }, 800);
  };

  if (isLoggedIn) {
    return <div>جاري التوجيه...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text">
            BMC OS
          </h1>
          <p className="text-xl text-slate-300 max-w-sm mx-auto leading-relaxed">
            نظام التشغيل المتقدم للشركات
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-3">
                اسم المستخدم
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/30 rounded-2xl text-lg font-semibold text-slate-900 placeholder-slate-500 focus:ring-4 ring-white/50 focus:outline-none transition-all backdrop-blur-sm"
                  placeholder="ahmrd"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-3">
                كلمة المرور
              </label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/30 rounded-2xl text-lg font-semibold text-slate-900 placeholder-slate-500 focus:ring-4 ring-white/50 focus:outline-none transition-all backdrop-blur-sm"
                  placeholder="ahmed"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-white to-slate-100 hover:from-slate-50 hover:to-white text-slate-900 font-black text-lg py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 backdrop-blur-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/30 text-center text-sm text-slate-400">
            BMC OS © 2024 • Enterprise Operations System
          </div>
        </div>
      </div>
    </div>
  );
}

