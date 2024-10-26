import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add any custom theme extensions here
      colors: {
        // Custom colors can be added here
      },
      fontFamily: {
        // Custom fonts can be added here
        'handwritten': ['var(--font-kalam)']
      },
      rotate: {
        '1': '1deg',
      },
    },
  },
  plugins: [],
  // Enable JIT mode
  darkMode: 'class', // or 'media' if you prefer system settings
  // If you need to prefix your classes (usually not needed for Next.js)
  prefix: '',
  // Important can be set to true if needed
  important: false,
}

export default config
