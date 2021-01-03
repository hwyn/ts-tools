import webpack, { HashedModuleIdsPlugin } from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import baseConfig from './webpack.base.config';
import { platformConfig } from '../config';

const { isDevelopment, tsConfig } = platformConfig();

export default () => {
  process.env.TS_NODE_PROJECT = tsConfig;
  return merge(baseConfig(), {
    optimization: {
      noEmitOnErrors: true,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          default: {
            chunks: 'async',
            minChunks: 2,
            priority: 10
          },
          common: {
            name: 'common',
            chunks: 'async',
            minChunks: 2,
            enforce: true,
            priority: 5
          },
          vendors: false,
          vendor: false
        }
      },
      minimizer: [
        new HashedModuleIdsPlugin(),
        new UglifyJSPlugin({
          sourceMap: isDevelopment,
          cache: true,
          parallel: true,
          uglifyOptions: {
            safari10: true,
            output: {
              ascii_only: true,
              comments: false,
              webkit: true,
            },
            compress: {
              pure_getters: true,
              passes: 3,
              inline: 3,
            }
          }
        }),
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'production'"
      }),
      new MiniCssExtractPlugin({
        filename: 'styleSheet/[name].[hash:4].css',
        chunkFilename: 'styleSheet/[name].[chunkhash:4].css',
      }),
    ]
  })
}
