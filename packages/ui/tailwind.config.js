/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          foreground: '#FAFAFA',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#1B4332',
        },
        background: '#FDFAF6',
        foreground: '#171717',
        border: '#E5E7EB',
        ring: '#1B4332',
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
