/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: {
          50:  '#fff5f5',
          100: '#ffe0e0',
          200: '#ffbcbc',
          300: '#ff8f8f',
          400: '#ff6b6b',
          500: '#ff4444',
          600: '#ed2424',
          700: '#c81a1a',
          800: '#a51919',
          900: '#881b1b',
        },
        warm: {
          50:  '#FAFAF8',
          100: '#F5F4F0',
          200: '#ECEAE4',
          300: '#D9D6CE',
          400: '#B8B4AB',
          500: '#8F8B82',
          600: '#706C64',
          700: '#565349',
          800: '#3D3B35',
          900: '#252320',
        },
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        warm: '0 1px 3px 0 rgba(80, 70, 50, 0.08), 0 1px 2px -1px rgba(80, 70, 50, 0.06)',
        'warm-md': '0 4px 6px -1px rgba(80, 70, 50, 0.08), 0 2px 4px -2px rgba(80, 70, 50, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(80, 70, 50, 0.10), 0 4px 6px -4px rgba(80, 70, 50, 0.07)',
      },
    },
  },
  safelist: [
    { pattern: /^(p|pt|pb|pl|pr|px|py|m|mt|mb|ml|mr|mx|my|gap|space-y|space-x)-(0|1|2|3|4|5|6|7|8|9|10|11|12|14|16|20|24)$/ },
  ],
  plugins: [],
}
