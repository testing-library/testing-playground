const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: false,
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.gray,
          500: '#728DA7',
        },
      },
    },
  },
  variants: {
    scale: ['focus', 'hover', 'group-hover'],
  },
};
