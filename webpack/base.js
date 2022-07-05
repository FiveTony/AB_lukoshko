const webpack = require("webpack");
const path = require("path");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // чистит папку dist


module.exports = {
  context: path.resolve(__dirname, "../src"),
  mode: "development",
  devtool: "eval-source-map", // сборка : самая медленная, пересборка : хорошо
  entry: {
    entry: ["babel-polyfill", "../index.js"],
  },
  devServer: {
    port: 8080,
  },
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "../index.html",
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ImageminWebpWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../src/assets/images"),
          to: path.resolve(__dirname, "../dist/src/assets/images"),
          globOptions: {
            ignore: ["*.DS_Store"],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 1, modules: false },
          },
          { loader: "sass-loader", options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(png|jpeg|svg|gif|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};