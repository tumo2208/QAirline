/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.js",
  ],
  theme: {
    extend: {
      textUnderlineOffset: {
        'custom': '4px',
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