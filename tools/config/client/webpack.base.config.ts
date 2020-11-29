import merge from 'webpack-merge';
import { Configuration, ProgressPlugin, DllReferencePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import { existsSync } from 'fs';
import webpackConfig, { getMergeConfig, copyPlugin } from '../base/webpack.config';
import { jsLoader, cssLoader } from '../../core/util';
import { babellrc, platformConfig, PlatformEnum } from '../config';
import { isEmpty } from 'lodash';

const { presets, plugins } = babellrc;
const {
  root,
  sourceRoot,
  sourceClient,
  nodeModules,
  index,
  main,
  themeVariable,
  styles,
  assets,
  outputPath,
  tsConfig,
  isDevelopment,
  builder,
  browserTarget = []
} = platformConfig(PlatformEnum.client);

const cssRules = cssLoader({
  ...(themeVariable ? { resources: themeVariable } : {})
}, !isDevelopment);
const jsRules = jsLoader({
  options: {
    presets: [
      ["@babel/preset-env", { "targets": browserTarget }],
      ...(presets || []).slice(1),
    ],
    plugins: plugins || []
  }
});

export default (): Configuration => merge(webpackConfig, {
  target: 'web',
  context: root,
  entry: {
    ...(!isEmpty(main) && { main } || {}),
    ...(!isEmpty(styles) && { styles } || {}),
  },
  output: {
    publicPath: '',
    path: outputPath,
    chunkFilename: `javascript/[name].[chunkhash:8].js`,
    filename: `javascript/[name].[hash:8].js`,
  },
  resolve: {
    symlinks: true,
    modules: [nodeModules, sourceRoot],
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
  },
  module: {
    rules: [
      jsRules.babel(),
      jsRules.ts({
        happyPackMode: true,
        transpileOnly: !isDevelopment,
        configFile: tsConfig,
        exclude: nodeModules,
        context: root
      }),
      cssRules.sass(),
    ],
  },
  plugins: [
    new ProgressPlugin(),
    ...copyPlugin(assets, outputPath, sourceClient),
    new WebpackAssetsManifest({
      output: `${outputPath}/../static/assets.json`,
      writeToDisk: true,
      publicPath: true,
      customize: ({ key, value }) => {
        if (key.toLowerCase().endsWith('.map')) return false;
        return { key, value };
      }
    }),
    ...existsSync(`${outputPath}/../static/dll-manifest.json`) ? [
      new DllReferencePlugin({
        context: root,
        manifest: require(`${outputPath}/../static/dll-manifest.json`)
      })
    ] : [],
    new HtmlWebpackPlugin({
      template: index
    })
  ],
}, getMergeConfig(builder, jsRules, cssRules));
