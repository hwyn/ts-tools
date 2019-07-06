import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import path from 'path';
import webpackConfig from '../base/webpack.config';
import { requireSync } from '../../core/fs';
import { jsLoader } from '../../core/util';
import config from '../config';

const { srcDir, baseDir, buildDir, babellrc, isDebug } = config;
const mergeServerConfig = requireSync(`${baseDir}/webpack.server.js`) || {};
const jsRules = jsLoader({ options: babellrc });

const _mergeServerConfig = (typeof mergeServerConfig === 'function' ? mergeServerConfig : () => mergeServerConfig)(jsRules, undefined, isDebug);

export default (): Configuration => merge(webpackConfig, {
  target: 'node',
  entry: {
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
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [
    nodeExtrnals(),
  ],
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
  plugins: [],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
}, _mergeServerConfig);
