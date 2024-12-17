/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.js",
];
export const theme = {
  extend: {
    textUnderlineOffset: {
      'custom': '4px',
    },
    animation: {
      ["infinite-slider"]: "infiniteSlider 40s linear infinite",
    },
    keyframes: {
      infiniteSlider: {
        "0%": { transform: "translateX(0)" },
        "100%": {
          transform: "translateX(calc(-400px*3))",
        },
      },
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    addUtilities({
      '.underline-offset-custom': {
        textDecoration: 'underline',
        textUnderlineOffset: '6px',
        textDecorationColor: 'currentColor',
      },
    });
  },
];