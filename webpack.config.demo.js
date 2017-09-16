var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var autoprefixer = require('autoprefixer');
var src = 'src';
var dist = 'demo';
var cssLoader = 'css?sourceMap&-minimize';

if (process.env.NODE_ENV === 'production') {
  cssLoader = 'css?-sourceMap&minimize';
}

var config = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: path.join(__dirname, 'index.js'),
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.join(__dirname, dist),
    filename: '[name].[hash].js',
    pathinfo: true
  },
  resolve: {
    root: path.resolve(__dirname)
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
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', cssLoader + '!postcss')
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', cssLoader + '!postcss!sass')
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.(woff|woff2)$/,
        loader: 'url?prefix=font/&limit=5000'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  postcss: [autoprefixer({browsers: ['last 2 versions']})],
  debug: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      hash: false,
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: false
      }
    }),
    new CleanWebpackPlugin([path.join(__dirname, dist)]),
    new webpack.optimize.CommonsChunkPlugin({names: ['vendor']}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.BannerPlugin('This file is created by dding')
  ],
  devServer: {
    inline: true,
    hot: true
  }
};

if (process.env.NODE_ENV === 'production') {
  config.output.filename = '[name].min.js';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    },
    sourceMap: false
  }));
}

module.exports = config;