const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // чистит папку dist
const CopyWebpackPlugin = require('copy-webpack-plugin') // скопировать спрайты
//const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')

const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
console.log(__dirname)

module.exports = {
    context: path.resolve(__dirname, '../src'),
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, '../prod/index.js')
    },
    devtool: false,
    performance: {
        hints: false,
        maxEntrypointSize: 900000,
        maxAssetSize: 900000
    },
    output: {
        filename: '[name].js', // название чанка - main 
        path: path.resolve(__dirname, '../dist') // так корректнее
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../prod/index.html'),
            minify: {
                collapseWhitespace: true // постоянно оптимизирован, если true
            }
        }),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, "../dist/results/index.html"),
            template: '../src/assets/results/index.html',
            minify: {
                collapseWhitespace: true,
            },
            inject: false,
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist/**/*')]
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, "../src/assets/results/app.js"),
              to: path.resolve(__dirname, "../dist/results/app.js"),
              globOptions: {
                ignore: ["*.DS_Store"],
              },
              noErrorOnMissing: true,
            },
          ],
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, "../src/assets/sounds"),
              to: path.resolve(__dirname, "../dist/src/assets/sounds"),
              globOptions: {
                ignore: ["*.DS_Store"],
              },
              noErrorOnMissing: true,
            },
          ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                  from: path.resolve(__dirname, '../src/assets/sprites'),
                  to: path.resolve(__dirname, '../dist/src/assets/sprites'),
                  globOptions: {
                      ignore: ['*.DS_Store'],
                  },
                  noErrorOnMissing: true,
                },
                {
                  from: path.resolve(__dirname, "../src/assets/styles"),
                  to: path.resolve(__dirname, "../dist/src/assets/styles"),
                  globOptions: {
                      ignore: ["*.DS_Store", "**/scss-styles"],
                  },
                  noErrorOnMissing: true,
                },
                {
                  from: path.resolve(__dirname, "../src/assets/html"),
                  to: path.resolve(__dirname, "../dist/src/assets/html"),
                  globOptions: {
                      ignore: ["*.DS_Store"],
                  },
                  noErrorOnMissing: true,
                },
                {
                  from: path.resolve(__dirname, "../src/assets/images"),
                  to: path.resolve(__dirname, "../dist/src/assets/images"),
                  globOptions: {
                      ignore: ["*.DS_Store"],
                  },
                  noErrorOnMissing: true,
                },
            ]
        }),
        new CopyWebpackPlugin({
          patterns: [                {
                  from: path.resolve(__dirname, "../src/assets/fonts"),
                  to: path.resolve(__dirname, "../dist/src/assets/fonts"),
                  globOptions: {
                      ignore: ["*.DS_Store"],
                  },
                  noErrorOnMissing: true,
                }]
        }),
        new MiniCssExtractPlugin({
        filename: "src/assets/styles/main-styles.css",
        }),
        new ImageminWebpWebpackPlugin({
            config: [
                {
                test: /\.(jpe?g|png)/,
                options: {
                    quality: 75,
                },
                },
            ],
            overrideExtension: true,
            detailedLogs: false,
            silent: false,
            strict: true,
        }),
    ],
    module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, "../src/assets/styles/scss-styles")],

        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: false,
              modules: false,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpeg|svg|gif|webp)$/,
        use: ["file-loader"],
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
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "../dist/src/assets/fonts/[name][ext]",
        },
      },
    ],
  },
};