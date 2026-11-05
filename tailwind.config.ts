import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#FFD12F',
        gold2: '#D99B00',
        ink: '#050505',
        ink2: '#0A0A0A',
        card: '#0D0D0D',
      },
    },
  },
  plugins: [],
};

export default config;
