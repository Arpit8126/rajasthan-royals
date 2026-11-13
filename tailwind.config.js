/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rr: {
          bg: '#181622',         // Official site deep charcoal-plum
          surface: '#1E1B2B',    // Main dark nav/container
          surface2: '#272236',   // Card background
          surfaceHover: '#312B43',
          card: '#272236',       // Image 4 card background
          cardBorder: '#3A334E', // Subtle muted mauve-slate border
          cardBox: '#332B45',    // Mini stat box background
          cardBoxBorder: '#453A5A',
          pink: '#E41B66',       // Official Rajasthan Royals Pink
          pinkHover: '#C21353',
          pinkLight: '#FF3B82',
          pinkSoft: 'rgba(228, 27, 102, 0.15)',
          blue: '#004BA0',
          blueNavy: '#0F265C',
          blueLight: '#1864CC',
          gold: '#E5A93C',
          goldLight: '#FBBF24',
          muted: '#A99EBD',      // Secondary label lavender-slate
          mutedDark: '#6E6482',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'rr-pink': '0 0 20px -2px rgba(228, 27, 102, 0.5)',
        'rr-card': '0 8px 24px -6px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
