/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./pages/*.{html,js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      '2xl': {'min': '1535px'},
      // => @media (min-width: 1535px) { ... }

      'xl': {'min': '1279px'},
      // => @media (min-width: 1279px) { ... }

      'lg': {'min': '1023px'},
      // => @media (min-width: 1023px) { ... }

      'md': {'min': '767px'},
      // => @media (min-width: 767px) { ... }

      'sm': {'min': '639px'},
      // => @media (min-width: 639px) { ... }
      
      '-2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      '-xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      '-lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      '-md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      '-sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#7289da",
        },
      },
    ],
  },
}
