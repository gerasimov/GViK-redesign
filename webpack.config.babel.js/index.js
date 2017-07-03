// @flow
import path from "path";
import webpack from "webpack";
import * as paths from "./paths";
import { GVIK_FILE_NAME } from "./../constants";
import MainifestPlugin from "./manifest";
import CleanPlugin from "./clean";
import CircularDependencyPlugin from "circular-dependency-plugin";

/**
 *
 */
const entry = {
  [GVIK_FILE_NAME]: path.join(paths.src, "app", "includes"),
  core: [
    "redux",
    "react",
    "react-dom",
    "react-redux",
    "prop-types",
    "classnames",
    "md5",
    path.join(paths.src, "helpers"),
    path.join(paths.src, "core")
  ],
  content: path.join(paths.src, "app", "content"),
  background: path.join(paths.src, "app", "background"),
  "pages.lastfm": path.join(paths.src, "app", "pages", "lastfm")
};

/**
 *
 */
const plugins = [
  new CleanPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: "core",
    filename: "core.js",
    chunks: ["core", GVIK_FILE_NAME, "content", "background"]
  }),
  new MainifestPlugin(),
  new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/
  })
];

/**
 *
 */
const output = {
  path: paths.build
};

/**
 *
 */
const module = {
  rules: []
};

/**
 *
 */
const resolve = {
  extensions: [".js", ".json", ".jsx", ".styl"],
  modules: ["node_modules"]
};

/**
 * @param {Object} env
 * @return {Object}
 */
export default (env: { [string]: any }) => {
  const isProd: boolean = !!env && env.hasOwnProperty("prod");

  output.filename = isProd ? "[name].js?[hash]" : "[name].js";

  const devs = {};

  if (isProd) {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    );
  }

  plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      )
    })
  );
  // if (isProd) {
  // } else {
  devs.devtool = "source-map";
  // }

  module.rules.push(
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader"
        }
      ]
    },
    {
      test: /\.html$/,
      include: [paths.src],
      use: [
        {
          loader: "file-loader"
        }
      ]
    },
    {
      test: /\.styl$/,
      include: [paths.src],
      use: [
        {
          loader: "style-loader"
        },
        {
          loader: "css-loader"
        },
        {
          loader: "stylus-loader",
          options: {
            paths: "node_modules/bootstrap-stylus/stylus/"
          }
        }
      ]
    }
  );

  return { entry, output, plugins, module, resolve, ...devs };
};
