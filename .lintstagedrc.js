module.exports = {
  '**/*.js': (files) => [
    `eslint --quiet --fix ${files.join(' ')}`,
    `jest --passWithNoTests`,
  ],
  '**/*.{md,js}': (files) => [`prettier --write ${files.join(' ')}`],
};
