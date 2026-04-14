/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // B&W Monochrome palette
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Primary: Dark slate/black
        primary: {
          50: '#f8fafc',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          900: '#020617',
        },
        // Accents limited to white/black/gray
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slideDown': 'slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slideInLeft': 'slideInLeft 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounceFloat': 'bounceFloat 1.2s infinite',
        'pulseGlow': 'pulseGlow 2s infinite',
        'ripple': 'ripple 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'chipStagger': 'chipEntrance 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 40px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'scaleY(0.8) translateY(-20px)' },
          '100%': { opacity: '1', transform: 'scaleY(1) translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translate3d(-30px, 0, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        bounceFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(59, 130, 246, 0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        chipEntrance: {
          '0%': { opacity: '0', transform: 'translate3d(0, 50px, 0) scale(0.9) rotate(-5deg)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)' },
        },
      },
    },

  },
  plugins: [],
};

