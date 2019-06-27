import path from 'path';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin } from 'webpack';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import config from '../config';

const { baseDir, babellrc, isDebug, buildDir } = config;
const jsRules = jsLoader({ options: babellrc });
const cssRules = cssLoader({}, isDebug);

const _mergeClientConfig = getMergeConfig(`webpack.server.entry.js`, jsRules, cssRules);

export default (): Configuration => merge(webpackConfig, {
  target: 'node',
  entry: {},
  output: {
    publicPath: '',
    path: path.join(buildDir, 'server'),
    chunkFilename: `check/[name].js`,
    filename: `[name].js`,
    libraryTarget: 'commonjs',
  },
  resolve: {
    symlinks: true,
    modules: [path.resolve(baseDir, 'node_modules'), path.relative(baseDir, 'src')],
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
  },
  module: {
    rules: [],
  },
  plugins: [
    new ProgressPlugin(),
  ],
  node: false,
}, _mergeClientConfig);