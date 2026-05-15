import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#3b82f6',
        accent: '#f59e0b',
        dark: '#1f2937',
        light: '#f9fafb',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
