/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gym: {
          bg: '#0a0a0a',       // Darker than neutral-900
          card: '#171717',     // neutral-900
          input: '#262626',    // neutral-800
          accent: '#3b82f6',   // blue-500
          success: '#10b981',  // emerald-500
          danger: '#ef4444',   // red-500
          text: '#f5f5f5',     // neutral-100
          muted: '#737373',    // neutral-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}