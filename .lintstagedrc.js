module.exports = {
  '**/*.js': (files) => [
    `eslint --quiet --fix ${files.join(' ')}`,
    `vitest --passWithNoTests`,
  ],
  '**/*.{md,js,json,yml,html,css,pcss}': (files) => [
    `prettier --write ${files.join(' ')}`,
  ],
};
