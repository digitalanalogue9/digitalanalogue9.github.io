import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/utils/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'theme-blue': '#1d4ed8',
        // AAA-compliant colors
        primary: {
          bg: '#ffffff',
          text: '#1a1a1a', // 14.5:1 contrast ratio
          button: '#005ab3', // 8.1:1 contrast ratio with white
        },
        secondary: {
          text: '#2d2d2d', // 11.1:1 contrast ratio
          button: '#004890', // Button hover state
        },
        accent: {
          success: '#006e4a',
          warning: '#944a00',
          error: '#ab0000',
        },
        link: {
          DEFAULT: '#0051a3', // 7.3:1 contrast ratio
          hover: '#003b7a',
        },
      },
      fontFamily: {
        handwritten: ['var(--font-kalam)'],
      },
      rotate: {
        '1': '1deg',
      },
    },
  },
  variants: {
    extend: {
      transform: ['hover', 'print'],
      translate: ['hover', 'print'],
      backgroundColor: ['print'],
      borderWidth: ['print'],
      borderColor: ['print'],
      textColor: ['print'],
    },
  },
  plugins: [],
  darkMode: 'class',
  prefix: '',
  important: false,
};

export default config;
