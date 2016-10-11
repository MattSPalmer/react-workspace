/* eslint-disable no-var, no-param-reassign */
var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map',
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory() && dir !== 'components') {
      entries[dir] = [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        path.join(__dirname, dir, 'app.jsx')
      ]
    }
    return entries
  }, {}),
  output: {
    path: path.join(__dirname, '/__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.css$/, loader: 'style!css'}
    ]
  },

  resolve: {
    alias: {
      'react-workspace': path.join(__dirname, '..', 'src')
    },
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]

}
