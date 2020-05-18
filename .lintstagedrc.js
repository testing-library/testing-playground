module.exports = {
  '**/*.js': (files) => [`eslint --quiet --fix ${files.join(' ')}`],
  '**/*.md': (files) => [`prettier --write ${files.join(' ')}`],
}
