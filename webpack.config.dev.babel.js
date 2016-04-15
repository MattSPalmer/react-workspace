/*eslint-env node*/
import webpack from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

export default {
  devtool: 'source-map',
  stats: {
    errorDetails: true
  },
  entry: './index.js',
  resolve: {
    root: path.resolve(__dirname),
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'static/')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new HTMLWebpackPlugin({
      inject: true,
      template: './src/htdocs/index.html'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
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
