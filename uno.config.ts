import { defineConfig } from 'unocss';

import { MD, LG } from './src/constants/breakpoints';

export default defineConfig({
  theme: {
    colors: {
      'light-blue': '#bbe1fa',
      'blue': '#30a9de',
      'light-gray': '#dddddd',
      'gray': '#bbbbbb',
      'deep-gray': '#666666',
    },
    breakpoints: {
      md: `${MD}px`,
      lg: `${LG}px`,
    },
  },
});
