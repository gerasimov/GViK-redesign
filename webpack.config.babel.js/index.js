// @flow
import path from 'path'
import webpack from 'webpack'
import * as paths from './paths'
import { GVIK_FILE_NAME } from './../constants'
import MainifestPlugin from './manifest'
import CleanPlugin from './clean'
/**
 *
 */
const entry = {
  [GVIK_FILE_NAME]: path.join(paths.src, 'app', 'includes'),
  core: [path.join(paths.src, 'helpers'), path.join(paths.src, 'core'), 'md5'],
  content: path.join(paths.src, 'app', 'content'),
  background: path.join(paths.src, 'app', 'background'),
  'pages.lastfm': path.join(paths.src, 'app', 'pages', 'lastfm')
}

/**
 *
 */
const plugins = [
  new CleanPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'core',
    filename: 'core.js',
    chunks: ['core', GVIK_FILE_NAME, 'content', 'background']
  }),
  new MainifestPlugin()
]

/**
 *
 */
const output = {
  path: paths.build
}

/**
 *
 */
const module = {
  rules: []
}

/**
 *
 */
const resolve = {
  extensions: ['.js', '.json', '.jsx', '.css'],
  modules: ['node_modules', paths.app]
}

/**
 * @param {Object} env
 * @return {Object}
 */
export default (env: { [string]: any }) => {
  const isProd: boolean = !!env && env.hasOwnProperty('prod')

  output.filename = isProd ? '[name].[hash].js' : '[name].js'

  const devs = {}

  if (isProd) {
    console.log(1)
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    )
  }
  // if (isProd) {
  // } else {
  devs.devtool = 'source-map'
  // }

  module.rules.push(
    {
      test: /\.jsx?$/,
      include: [paths.src],
      loader: 'babel-loader'
    },
    {
      test: /\.html$/,
      include: [paths.src],
      loader: 'file-loader'
    }
  )

  return { entry, output, plugins, module, resolve, ...devs }
}
