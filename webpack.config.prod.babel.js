/*eslint-env node*/
import webpack from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

export default {
  stats: {
    errorDetails: true
  },
  entry: './index.js',
  resolve: {
    root: path.resolve(__dirname),
  },
  output: {
    filename: 'bundle.min.js',
    path: path.join(__dirname, 'static/')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new HTMLWebpackPlugin({
      inject: true,
      template: './src/htdocs/index.html'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '/src'),
        loaders: ['babel']
      },
    ]
  }
}
