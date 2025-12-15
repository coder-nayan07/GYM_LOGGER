/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          bg: '#0a0a0a',       // Deep black background
          card: '#171717',     // Card background
          input: '#262626',    // Input fields
          accent: '#3b82f6',   // Blue primary
          success: '#10b981',  // Green success
          danger: '#ef4444',   // Red delete
          text: '#f5f5f5',     // White text
          muted: '#737373',    // Gray text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}