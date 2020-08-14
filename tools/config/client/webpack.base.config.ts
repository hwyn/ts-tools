import path from 'path';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin, DllReferencePlugin } from 'webpack';
import AssetsWebpackPlugin from 'assets-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { existsSync } from 'fs';
import webpackConfig, { getMergeConfig } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import config from '../config';

const { srcDir, baseDir, buildDir, babellrc: { presets, plugins }, browserslist, isDebug } = config;
const copyPlugin = new CopyPlugin({ patterns: [{ from: path.join(baseDir, 'public'), to: path.join(buildDir, 'public') }] });

const cssRules = cssLoader({}, isDebug);
const jsRules = jsLoader({
  options: {
    presets: [
      ["@babel/preset-env", {
        "targets": browserslist,
      }],
      ...(presets || []).slice(1),
    ],
    plugins: plugins || []
  }
});

const _mergeClientConfig = getMergeConfig(`webpack.client.js`, jsRules, cssRules);

export default (): Configuration => merge(webpackConfig, {
  target: 'web',
  context: baseDir,
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
    rules: [],
  },
  plugins: [
    new ProgressPlugin(),
    copyPlugin,
    new AssetsWebpackPlugin({
      filename: 'assets.json',
      path: buildDir,
      prettyPrint: true,
      update: true,
    }),
    ...existsSync(`${buildDir}/static/dll-manifest.json`) ? [
      new DllReferencePlugin({
        context: baseDir,
        manifest: require(`${buildDir}/static/dll-manifest.json`),
      })
    ] : [],
  ],
}, _mergeClientConfig);
