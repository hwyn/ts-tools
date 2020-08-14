import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import webpackConfig, { getMergeConfig, filterAttr } from '../base/webpack.config';
import { jsLoader } from '../../core/util';
import config from '../config';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { srcDir, baseDir, buildDir, babellrc } = config;
const jsRules = jsLoader({ options: babellrc });
const copyPlugin = new CopyPlugin({ patterns: [{ from: path.join(baseDir, '.env'), to: path.join(buildDir, '.env') }] });
const _mergeServerConfig: any = getMergeConfig(`webpack.server.js`, jsRules, undefined) || {};

export default (): Configuration => merge(webpackConfig, {
  target: 'node',
  context: baseDir,
  entry: _mergeServerConfig && _mergeServerConfig.entry ? _mergeServerConfig.entry : {
    server: path.resolve(srcDir, 'server/index.ts'),
  },
  output: {
    path: buildDir,
    chunkFilename: `[name].check.[hash:8].js`,
    filename: `[name].js`,
    library: 'commonjs2',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    plugins: [new TsconfigPathsPlugin({})]
  },
  externals: _mergeServerConfig.isNodExternals !== false ? [
    nodeExtrnals(),
  ] : [],
  module: {
    rules: [
      jsRules.babel(),
      jsRules.ts({
        transpileOnly: true,
        context: baseDir,
        configFile: 'tsconfig.json',
      }),
    ],
  },
  plugins: [copyPlugin],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
}, filterAttr(_mergeServerConfig, ['isNodExternals']));
