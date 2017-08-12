import BabiliPlugin from "babili-webpack-plugin";
import webpack from "webpack";

export default ({ plugins, ...config }) => {
  plugins.push(
    new BabiliPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );

  return {
    ...config,
    plugins
  };
};
