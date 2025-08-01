import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  prefix: '',
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F5'
      },
      animation: {
      fadeIn: 'fadeIn 0.15s ease-in-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: "0", transform: 'translateY(4px)' },
        '100%': { opacity: "1", transform: 'translateY(0)' },
      },
    },
    },
    fontFamily: {
      satoshi: ['Satoshi', 'san-serif']
    }
  },
  plugins: [],
}
export default config
