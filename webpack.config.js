const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {

  // webpack entry point to application
  entry: './src/index.js',

  // Path and filename for the webpack bundle
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    // We need the vue loader
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader'
    }]
  },
  plugins: [
    // This plugin is required for the vue loader
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },

  // Default mode for Webpack is production.
  mode: 'development'
};