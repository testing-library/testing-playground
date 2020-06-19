const tailwindcss = require('tailwindcss');
const atImport = require('postcss-import');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const plugins = [atImport, tailwindcss];

if (IS_PRODUCTION) {
  const purgecss = require('@fullhuman/postcss-purgecss');

  class TailwindExtractor {
    static extract(content) {
      return content.match(/[A-z0-9-:/]+/g) || [];
    }
  }

  plugins.push(
    purgecss({
      content: [
        'src/*.html',
        'src/**/*.js',
        'devtools/**/*.js',
        'devtools/**/*.html',
      ],
      whitelist: ['body', /CodeMirror/],
      whitelistPatternsChildren: [/CodeMirror/, /cm-s-dracula/],
      defaultExtractor: TailwindExtractor.extract,
    }),
  );
}

module.exports = { plugins };
