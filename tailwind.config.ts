import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'abundant-blue': '#79B2E6',
        'deep-navy': '#080c12',
        'card-bg': '#0C1822',
      },
    },
  },
  plugins: [],
}
export default config
