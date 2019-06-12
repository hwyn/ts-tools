import nodeExtrnals from 'webpack-node-externals';
import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import path from 'path';
import { requireSync } from '../../core/fs';
import { jsLoader } from '../../core/util';
import config from '../config';

const { srcDir, baseDir, buildDir, babellrc } = config;
const mergeServerConfig = requireSync(`${baseDir}/webpack.server.js`) || {};
const jsRules = jsLoader({ options: babellrc });

export default (): Configuration => merge({
  context: baseDir,
  target: 'node',
  entry: {
    index: path.resolve(srcDir, 'server/index.ts'),
  },
  output: {
    path: buildDir,
    chunkFilename: `server/[name].check.[hash:8].js`,
    filename: `server/[name].js`,
    library: 'commonjs2',
  },
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [
    '../build/assets.json',
    nodeExtrnals(),
  ],
  module: {
    rules: [
      jsRules.babel(),
      jsRules.ts({
        transpileOnly: true,
        context: baseDir,
        configFile: 'ts.server.json',
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
  stats: {
    colors: true,
    timings: true,
  },
}, mergeServerConfig);
