module.exports = {
  '**/*.js': (files) => [
    `eslint --quiet --fix ${files.join(' ')}`,
    `vitest related --run`,
  ],
  '**/*.{md,js,json,yml,html,css,pcss}': (files) => [
    `prettier --write ${files.join(' ')}`,
  ],
};
