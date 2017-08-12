import path from "path";
import webpack from "webpack";
import * as paths from "./paths";
import { GVIK_FILE_NAME } from "./../constants";
import MainifestPlugin from "./plugins/manifest";
import CleanPlugin from "./plugins/clean";
// import CircularDependencyPlugin from "circular-dependency-plugin";

import HtmlWebpackPlugin from "html-webpack-plugin";

export const entry = {
  react: ["react", "react-dom", "react-redux", "redux", "react-router"],
  [GVIK_FILE_NAME]: path.join(paths.srcApp, "includes"),
  popup: path.join(paths.pages, "popup", "popup.js"),
  core: [
    "./constants",
    path.join(paths.src, "helpers"),
    path.join(paths.src, "core"),
    "blueimp-md5"
  ],
  content: path.join(paths.srcApp, "content"),
  background: path.join(paths.srcApp, "background")
};

export const plugins = [
  new CleanPlugin(),

  new webpack.optimize.CommonsChunkPlugin({
    name: "core",
    filename: "core.js",
    chunks: ["core", "react", GVIK_FILE_NAME, "content", "background", "popup"]
  }),

  new MainifestPlugin(),
  // new CircularDependencyPlugin({
  //   exclude: /node_modules/
  // }),
  new HtmlWebpackPlugin({
    chunks: ["core", "popup"],
    chunksSortMode: function(chunk1, chunk2) {
      let orders = ["core", "popup"];
      let order1 = orders.indexOf(chunk1.names[0]);
      let order2 = orders.indexOf(chunk2.names[0]);
      if (order1 > order2) {
        return 1;
      } else if (order1 < order2) {
        return -1;
      } else {
        return 0;
      }
    },
    filename: "popup.html",
    template: path.join(paths.pages, "popup", "popup.html")
  }),
  new HtmlWebpackPlugin({
    chunks: [],
    filename: "oauth.html",
    template: path.join(paths.pages, "oauth.html")
  })
  // new BundleAnalyzerPlugin()
];

/**
 *
 */
export const output = {
  path: paths.build,
  filename: "[name].js"
};

/**
 *
 */
export const module = {
  rules: require("./rules.js").default
};

export const resolve = {
  extensions: [".js", ".json", ".jsx", ".styl"],
  modules: ["node_modules"]
};
