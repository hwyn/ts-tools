import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin } from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import config from '../config';

const { baseDir, buildDir, browserslist, babellrc: { presets, plugins } } = config;
const jsRules = jsLoader({
  options: {
    presets: [
      ["@babel/preset-env", {
        "targets": browserslist,
      }],
      ...(presets || []).slice(1),
    ],
    plugins: [
      ...(plugins || []),
    ],
  }
});

const cssRules = cssLoader({}, false);
const _mergeDllConfig = getMergeConfig(`webpack.dll.js`, jsRules, undefined);

export default (): Configuration => merge(webpackConfig, {
  target: 'web',
  entry: {},
  output: {
    path: path.join(buildDir, 'public'),
    filename: 'javascript/[name].dll.js',
    chunkFilename: `check/[name].[chunkhash:8].js`,
    library: "[name]_[hash:8]",
  },
  module: {
    rules: [
      jsRules.babel({}),
      jsRules.ts({
        happyPackMode: true,
        transpileOnly: true,
        context: baseDir,
        configFile: 'ts.client.json',
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
      output: `${buildDir}/dll.json`,
      writeToDisk: true,
      publicPath: true,
      customize: ({ key, value }) => {
        if (key.toLowerCase().endsWith('.map')) return false;
        return { key, value };
      }
    }),
    new webpack.DllPlugin({
      path: path.join(buildDir, "static/dll-manifest.json"),
      name: "[name]_[hash:8]"
    }),
  ],
}, _mergeDllConfig);
