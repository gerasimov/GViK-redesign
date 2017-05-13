import path from 'path';
import webpack from 'webpack';
import * as paths from './paths';
import {GVIK_FILE_NAME} from './../constants';

/**
 *
 */
const entry = {
  [GVIK_FILE_NAME]: path.join(paths.src, 'index.js'),
  'core': [
    path.join(paths.src, 'helpers'),
    path.join(paths.src, 'core')],
  'content': path.join(paths.src, 'content'),
  'background': path.join(paths.src, 'background'),
  'pages/lastfm': path.join(paths.src, 'pages',
      'lastfm'),
};

/**
 *
 */
const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'core',
    filename: 'core.js',
    chunks: ['core', GVIK_FILE_NAME, 'content', 'background'],
  }),
];

/**
 *
 */
const output = {
  path: paths.build,
};

/**
 *
 */
const module = {
  rules: [],
};

/**
 *
 */
const resolve = {
  extensions: ['.js', '.json', '.jsx', '.css'],
  modules: ['node_modules', paths.app],
};

/**
 * @param {Object} env
 * @return {Object}
 */
export default (env: Object) => {
  const isProd: Boolean = env && env.hasOwnProperty('prod');
  output.filename = isProd ? '[name].[hash].js' : '[name].js';

  const devs = {};

  if (isProd) {
  } else {
    devs.devtool = 'eval-source-map';
  }

  module.rules.push({
    test: /\.jsx?$/,
    include: [paths.src],
    loader: 'babel-loader',
  });

  module.rules.push({
    test: /\.html$/,
    include: [paths.src],
    loader: 'file-loader',
  });

  return Object.assign({entry, output, plugins, module, resolve}, devs);
};
