const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist", "umd"), // string
    filename: "multi-grid.js", // string
    library: "MultiGrid", // string,
    libraryTarget: "umd", // universal module definition
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: true
        }
      }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
}