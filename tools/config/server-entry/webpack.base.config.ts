import merge from 'webpack-merge';
import { Configuration, ProgressPlugin } from 'webpack';
import nodeExtrnals from 'webpack-node-externals';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import {  babellrc,  platformConfig, PlatformEnum }  from '../config';

const { main, builder, isDevelopment, outputPath, nodeModules, sourceRoot } = platformConfig(PlatformEnum.serverEntry);
const jsRules = jsLoader({ options: babellrc });
const cssRules = cssLoader({}, !isDevelopment);

export default (): Configuration => merge(webpackConfig, {
  target: 'node',
  entry: main && { main } || {},
  output: {
    publicPath: '',
    path: outputPath,
    chunkFilename: `check/[name].js`,
    filename: `[name].js`,
    libraryTarget: 'commonjs',
  },
  resolve: {
    symlinks: true,
    modules: [nodeModules, sourceRoot],
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
  },
  externals: [
    `${outputPath}/assets.json`,
    nodeExtrnals(),
  ],
  module: {
    rules: [],
  },
  plugins: [
    new ProgressPlugin(),
  ],
  node: false,
}, getMergeConfig(builder, jsRules, cssRules));