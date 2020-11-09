import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import path from 'path';
import webpackConfig, { getMergeConfig, filterAttr, copyPlugin } from '../base/webpack.config';
import { jsLoader } from '../../core/util';
import { srcDir, baseDir, buildDir, babellrc } from '../config';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const jsRules = jsLoader({ options: babellrc });
const _mergeServerConfig: any = getMergeConfig(`webpack.server.js`, jsRules, undefined) || {};
const { entry = {
  server: path.resolve(srcDir, 'server/index.ts'),
}, isNodExternals } = _mergeServerConfig;

export default (): Configuration => merge(webpackConfig, {
  target: 'node',
  context: baseDir,
  entry,
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
  externals: isNodExternals !== false ? [nodeExtrnals()] : [],
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
  plugins: [
    ...copyPlugin(path.join(baseDir, '.env'), path.join(buildDir))
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
}, filterAttr(_mergeServerConfig, ['isNodExternals']));
