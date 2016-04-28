import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

export default {
  devtool: 'inline-source-map',
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory())
      entries[dir] = path.join(__dirname, dir, 'app.js')

    return entries
  }, {})
}
