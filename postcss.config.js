const tailwindcss = require('tailwindcss');
const easyImport = require('postcss-easy-import');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const plugins = [easyImport, tailwindcss];

if (!IS_DEVELOPMENT) {
  const purgecss = require('@fullhuman/postcss-purgecss');

  class TailwindExtractor {
    static extract(content) {
      return content.match(/[A-z0-9-:\/]+/g) || [];
    }
  }

  plugins.push(
    purgecss({
      content: ['src/*.html', 'src/**/*.js'],
      whitelist: ['body'],
      extractors: [
        {
          extractor: TailwindExtractor,
          extensions: ['html']
        }
      ],
    })
  );
}

module.exports = { plugins }