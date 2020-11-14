import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin } from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';

const { presets, plugins } = babellrc;
const {
  root,
  output,
  builder,
  main,
  assetsPath,
  tsConfig,
  browserTarget
} = platformConfig(PlatformEnum.dll);

const jsRules = jsLoader({
  options: {
    presets: [
      ["@babel/preset-env", { "targets": browserTarget }],
      ...(presets || []).slice(1),
    ],
    plugins: [
      ...(plugins || []),
    ],
  }
});

const cssRules = cssLoader({}, false);

export default (): Configuration => merge(webpackConfig, {
  target: 'web',
  entry: main && { common: main } || {},
  output: {
    path: assetsPath,
    filename: 'javascript/[name].dll.js',
    chunkFilename: `javascript/[name].[chunkhash:8].js`,
    library: "[name]_[hash:8]",
  },
  module: {
    rules: [
      jsRules.babel({}),
      jsRules.ts({
        happyPackMode: true,
        transpileOnly: true,
        context: root,
        configFile: tsConfig,
      }),
      cssRules.less({
        javascriptEnabled: true,
      }),
      cssRules.css({}),
    ]
  },
  plugins: [
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styleSheet/[name].[hash:8].css',
      chunkFilename: 'styleSheet/[name].[chunkhash:8].css',
    }),
    new WebpackAssetsManifest({
      output: `${output}/static/dll.json`,
      writeToDisk: true,
      publicPath: true,
      customize: ({ key, value }) => {
        if (key.toLowerCase().endsWith('.map')) return false;
        return { key, value };
      }
    }),
    new webpack.DllPlugin({
      context: root,
      path: `${output}/static/dll-manifest.json`,
      name: "[name]_[hash:8]"
    }),
  ],
}, getMergeConfig(builder, jsRules));
