import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin } from 'webpack';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { jsLoader, cssLoader } from '../../core/util';
import { requireSync } from '../../core/fs';
import config from '../config';

const { baseDir, buildDir, browserslist, babellrc: { presets, plugins }, isDebug } = config;
const mergeDllConfig = requireSync(`${baseDir}/webpack.dll.js`);

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
const extractLess = new ExtractTextPlugin(`styleSheet/[name]less.[hash:8].css`);
const extractScss = new ExtractTextPlugin(`styleSheet/[name]scss.[hash:8].css`);
const extractOther = new ExtractTextPlugin(`styleSheet/[name]css.[hash:8].css`);
const cssRules = cssLoader({});
const _mergeDllConfig = (typeof mergeDllConfig === 'function' ? mergeDllConfig : () => mergeDllConfig)(jsRules, cssRules, { 
  extractLess,
  extractScss,
  extractOther,
}, isDebug);
const assetsPlugin = new AssetsWebpackPlugin({
  filename: 'dll.json',
  path: buildDir,
  prettyPrint: true,
  update: true,
});

export default (): Configuration => merge({
  context: baseDir,
  target: 'web',
  entry: {},
  output: {
    path: path.join(buildDir, 'public'),
    filename: 'javascript/dll_[name].js',
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
      }, extractLess),
      cssRules.css({}, extractOther),
    ]
  },
  plugins: [
    assetsPlugin,
    extractLess,
    extractScss,
    extractOther,
    new ProgressPlugin(),
    new webpack.DllPlugin({
      path: path.join(buildDir, "dll-manifest.json"),
      name: "[name]_[hash:8]"
    }),
  ],
  stats: {
    colors: true,
    timings: true,
  },
}, _mergeDllConfig);