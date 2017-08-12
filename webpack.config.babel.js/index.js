// @flow
import "./../src/helpers/babel.js";
import webpack from "webpack";
import { resolve, entry, output, plugins, module } from "./default";

/**
 * @param {Object} env
 * @return {Object}
 */
export default (env: { [string]: any }) => {
  const isProd: boolean = !!env && env.hasOwnProperty("prod");

  const mod = isProd ? require("./prod.js") : require("./dev.js");

  plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        isProd ? "production" : "development"
      )
    })
  );
  

  return mod.default({ entry, output, plugins, module, resolve });
};
