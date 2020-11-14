import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const jsRules = jsLoader({ options: babellrc });

const {
  root,
  output,
  main,
  assets,
  assetsPath,
  nodeExternals,
  tsConfig,
  builder
} = platformConfig(PlatformEnum.server);

const _mergeServerConfig: any = getMergeConfig(builder, jsRules) || {};

export default (): Configuration => merge(webpackConfig, {
  target: 'node',
  context: root,
  entry: main && { server: main } || {},
  output: {
    path: output,
    chunkFilename: `[name].[chunkhash:8].js`,
    filename: `[name].js`,
    library: 'commonjs2',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    plugins: [new TsconfigPathsPlugin({})]
  },
  externals: nodeExternals !== false ? [nodeExtrnals()] : [],
  module: {
    rules: [
      jsRules.babel(),
      jsRules.ts({
        transpileOnly: true,
        context: root,
        configFile: tsConfig,
      }),
    ],
  },
  plugins: [
    ...copyPlugin(assets, assetsPath),
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
}, _mergeServerConfig);
