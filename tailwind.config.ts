import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: '#113f2d',
        navy: '#071d2f',
        glow: '#d9f3d9',
        warning: '#f59e0b',
        danger: '#dc2626',
        info: '#0ea5e9',
      },
      boxShadow: {
        soft: '0 20px 45px rgba(12, 25, 20, 0.08)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(34, 197, 94, 0.18), rgba(6, 25, 38, 0.1) 28%, rgba(255,255,255,0) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
