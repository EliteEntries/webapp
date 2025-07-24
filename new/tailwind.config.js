module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '2xl': {'min': '1535px'},
        'xl': {'min': '1279px'},
        'lg': {'min': '1023px'},
        'md': {'min': '767px'},
        'sm': {'min': '639px'},
        '-2xl': {'max': '1535px'},
        '-xl': {'max': '1279px'},
        '-lg': {'max': '1023px'},
        '-md': {'max': '767px'},
        '-sm': {'max': '639px'},
      },
    },
  },
}