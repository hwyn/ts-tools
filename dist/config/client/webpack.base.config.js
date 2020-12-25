"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpack = require("webpack");
var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));
var _webpackAssetsManifest = _interopRequireDefault(require("webpack-assets-manifest"));
var _fs = require("fs");
var _webpack2 = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = require("../config");
var _circularDependencyPlugin = _interopRequireDefault(require("circular-dependency-plugin"));
var _lodash = require("lodash");function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { presets, plugins } = _config.babellrc;
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
  browserTarget = [] } =
(0, _config.platformConfig)(_config.PlatformEnum.client);

const cssRules = (0, _util.cssLoader)({
  ...(themeVariable ? { resources: themeVariable } : {}) },
!isDevelopment);
const jsRules = (0, _util.jsLoader)({
  options: {
    presets: [
    ["@babel/preset-env", { "targets": browserTarget }],
    ...(presets || []).slice(1)],

    plugins: plugins || [] } });


const fileRules = (0, _util.fileLoader)();var _default =

() => (0, _webpackMerge.default)(_webpack2.default, {
  target: 'web',
  context: root,
  entry: {
    ...(!(0, _lodash.isEmpty)(main) && { main } || {}),
    ...(!(0, _lodash.isEmpty)(styles) && { styles } || {}) },

  output: {
    publicPath: '',
    path: outputPath,
    chunkFilename: `javascript/[name].[chunkhash:8].js`,
    filename: `javascript/[name].[hash:8].js` },

  resolve: {
    symlinks: true,
    modules: [nodeModules, sourceRoot],
    extensions: ['.ts', '.tsx', '.mjs', '.js'] },

  module: {
    rules: [
    jsRules.babel(),
    jsRules.ts({
      happyPackMode: true,
      transpileOnly: !isDevelopment,
      configFile: tsConfig,
      exclude: nodeModules,
      context: root }),

    cssRules.sass(),
    fileRules.image({ publicPath: '/', name: 'images/[name][hash:4].[ext]' }),
    fileRules.font({ publicPath: '/', name: 'fonts/[name][hash:4].[ext]' })] },


  plugins: [
  new _webpack.ProgressPlugin(),
  ...(0, _webpack2.copyPlugin)(assets, outputPath, sourceClient),
  new _circularDependencyPlugin.default({
    exclude: /node_modules/,
    failOnError: true,
    allowAsyncCycles: false,
    cwd: root }),

  new _webpackAssetsManifest.default({
    output: `${outputPath}/../static/assets.json`,
    writeToDisk: true,
    publicPath: true,
    customize: ({ key, value }) => {
      if (key.toLowerCase().endsWith('.map')) return false;
      return { key, value };
    } }),

  ...((0, _fs.existsSync)(`${outputPath}/../static/dll-manifest.json`) ? [
  new _webpack.DllReferencePlugin({
    context: root,
    manifest: require(`${outputPath}/../static/dll-manifest.json`) })] :

  []),
  new _htmlWebpackPlugin.default({
    template: index })] },


(0, _webpack2.getMergeConfig)(builder, jsRules, cssRules));exports.default = _default;