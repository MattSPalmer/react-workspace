/* eslint-disable no-console, no-var */
var fs = require('fs')
var path = require('path')
var express = require('express')
var rewrite = require('express-urlrewrite')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var compiler = webpack(config)

var app = express()

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true
  }
}))

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}))


fs.readdirSync(__dirname).forEach(file => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite(`/${file}/*`, `/${file}/index.html`))
  }
})

app.use(express.static(__dirname))

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})
