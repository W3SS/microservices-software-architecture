'use strict';

// Modules
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function makeWebpackConfig() {
  var config = {};

  config.mode = 'development',

  config.entry = {
    app: './src/app/app.js'
  };

  config.output = {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  };

  config.devtool = 'source-map';

  config.module = {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style-loader'
      // loader: ExtractTextPlugin.extract({
      //   fallback: 'style-loader',
      //   use: ["css-loader"]
      //   loader: [
      //     {loader: 'css-loader', query: {sourceMap: true}},
      //     {loader: 'postcss-loader'}
      //   ],
      // })
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file-loader'
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  };

  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    })
  ];

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    })

    // new ExtractTextPlugin({filename: 'css/[name].css', disable: true, allChunks: true})
  )

  config.devServer = {
    contentBase: './src/dist/',
    // stats: 'minimal',
    // host: '0.0.0.0'
  };

  return config;
}();
