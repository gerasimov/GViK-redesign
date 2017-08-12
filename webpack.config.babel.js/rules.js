import * as paths from "./paths";

export default [
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
    test: /\.(png)$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
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
];
