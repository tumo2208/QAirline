/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      textUnderlineOffset: {
        'custom': '4px',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-400px * 9))' },
        },
      },
      animation: {
        scroll: 'scroll 80s linear infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.underline-offset-custom': {
          textDecoration: 'underline',
          textUnderlineOffset: '6px',
          textDecorationColor: 'currentColor',
        },
      });
    },
  ],
}