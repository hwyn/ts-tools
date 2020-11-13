import path from 'path';
import merge from 'webpack-merge';
import { Configuration, ProgressPlugin, DllReferencePlugin } from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { existsSync } from 'fs';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import { srcDir, baseDir, buildDir, babellrc, browserslist, isDebug, project } from '../config';

const { presets, plugins } = babellrc;

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

export default (): Configuration => merge(webpackConfig, {
  target: 'web',
  context: baseDir,
  entry: {
    main: path.resolve(srcDir, 'client/main.ts'),
  },
  output: {
    publicPath: '',
    path: path.join(project.output, 'public'),
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
    ...copyPlugin(path.join(baseDir, 'public'), path.join(buildDir, 'public')),
    new WebpackAssetsManifest({
      output: `${buildDir}/assets.json`,
      writeToDisk: true,
      publicPath: true,
      customize: ({ key, value }) => {
        if (key.toLowerCase().endsWith('.map')) return false;
        return { key, value };
      }
    }),
    ...existsSync(`${buildDir}/static/dll-manifest.json`) ? [
      new DllReferencePlugin({
        context: baseDir,
        manifest: require(`${buildDir}/static/dll-manifest.json`),
      })
    ] : [],
  ],
}, getMergeConfig(`webpack.client.js`, jsRules, cssRules));
