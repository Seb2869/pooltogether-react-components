const postcss = require('rollup-plugin-postcss')
const url = require('@rollup/plugin-url')

module.exports = {
  rollup(config, options) {
    config.plugins = [
      url({
        limit: 143360
      }),
      postcss({
        plugins: [
          require('postcss-import'),
          require('tailwindcss'),
          // require('postcss-nesting'),
          require('autoprefixer')
          // require('cssnano')
        ],
        inject: false,
        minimize: true,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: 'globals.css'
      }),
      ...config.plugins
    ]
    return config
  }
}
