// tailwind.config.mjs

// import postcssConfig from './postcss.config.mjs'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        mono: ['var(--font-your-mono-font-variable)', 'ui-monospace'],
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ['corporate', 'business'],
  },
};

export default config;