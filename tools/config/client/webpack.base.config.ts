import path from 'path';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { requireSync } from '../../core/fs';
import { jsLoader, cssLoader } from '../../core/util';
import config from '../config';

const { srcDir, baseDir, buildDir, babellrc, browserslist, isDebug } = config;
const mergeClientConfig = requireSync(`${baseDir}/webpack.client.js`);

const assetsPlugin = new AssetsWebpackPlugin({
  filename: 'assets.json',
  path: buildDir,
  prettyPrint: true,
  update: true,
});
const copyPlugin = new CopyPlugin([{ from: path.join(baseDir, 'public'), to: path.join(buildDir, 'public') }]);
const { presets, plugins } = babellrc;
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

const cssRules = cssLoader({}, isDebug);

const _mergeClientConfig = (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig)(jsRules, cssRules, isDebug);

export default (): Configuration => merge({
  context: baseDir,
  target: 'web',
  entry: {
    main: path.resolve(srcDir, 'client/main.ts'),
  },
  output: {
    publicPath: '',
    path: path.join(buildDir, 'public'),
    chunkFilename: `check/[name].[chunkhash:8].js`,
    filename: `javascript/[name].[hash:8].js`,
  },
  resolve: {
    symlinks: true,
    modules: [path.resolve(baseDir, 'node_modules'), path.relative(baseDir, 'src')],
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
  },
  module: {
    rules: [ ],
  },
  plugins: [
    new ProgressPlugin(),
    copyPlugin,
    assetsPlugin,
    new MiniCssExtractPlugin({
      filename: 'styleSheet/[name].[hash:8].css',
      chunkFilename: 'styleSheet/[name].[chunkhash:8].css',
    }),
  ],
  stats: {
    colors: true,
    timings: true,
  },
}, _mergeClientConfig);
