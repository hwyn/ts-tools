import webpack, { HashedModuleIdsPlugin, DllReferencePlugin } from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { existsSync } from 'fs';
import baseConfig from './webpack.base.config';
import config from '../config';

const { buildDir, baseDir } = config;

export default () => merge(baseConfig(), {
  mode: 'production',
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
        sourceMap: true,
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
    ...existsSync(`${buildDir}/dll-manifest.json`) ? [
      new DllReferencePlugin({
        context: baseDir,
        manifest: require(`${buildDir}/dll-manifest.json`),
      })
    ] : [],
  ]
});
