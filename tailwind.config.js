/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#043A65',
        secondary: {
          teal: '#14b8a6',
          amber: '#f59e0b',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
        },
        border: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
        },
        text: {
          primary: '#111827',
          secondary: '#6b7280',
          muted: '#9ca3af',
        },
      },
      fontSize: {
        caption: ['12px', { lineHeight: '16px' }],
        body: ['14px', { lineHeight: '20px' }],
        h3: ['18px', { lineHeight: '28px', fontWeight: '500' }],
        h2: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        h1: ['24px', { lineHeight: '32px', fontWeight: '600' }],
      },
      spacing: {
        18: '72px', // 4.5rem
        22: '88px', // 5.5rem
        30: '120px', // 7.5rem
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
