"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireWildcard(require("webpack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _webpackAssetsManifest = _interopRequireDefault(require("webpack-assets-manifest"));
var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));
var _webpack2 = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = require("../config");
var _path = _interopRequireDefault(require("path"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}

const { presets, plugins } = _config.babellrc;
const {
  root,
  builder,
  main,
  outputPath,
  tsConfig,
  browserTarget } =
(0, _config.platformConfig)(_config.PlatformEnum.dll);

const jsRules = (0, _util.jsLoader)({
  options: {
    presets: [
    ["@babel/preset-env", { "targets": browserTarget }],
    ...(presets || []).slice(1)],

    plugins: [
    ...(plugins || [])] } });




const cssRules = (0, _util.cssLoader)({}, false);var _default =

() => (0, _webpackMerge.default)(_webpack2.default, {
  target: 'web',
  entry: main && { common: main } || {},
  output: {
    path: outputPath,
    filename: 'javascript/[name].dll.js',
    chunkFilename: `javascript/[name].[chunkhash:8].js`,
    library: "[name]_[hash:8]" },

  module: {
    rules: [
    jsRules.babel(),
    jsRules.ts({
      transpileOnly: true,
      context: root,
      configFile: tsConfig }),

    cssRules.css(),
    cssRules.less({
      javascriptEnabled: true }),

    cssRules.sass()] },


  plugins: [
  new _webpack.ProgressPlugin(),
  new _miniCssExtractPlugin.default({
    filename: 'styleSheet/[name].[hash:8].css',
    chunkFilename: 'styleSheet/[name].[chunkhash:8].css' }),

  new _webpackAssetsManifest.default({
    output: _path.default.join(outputPath, '../static/dll.json'),
    writeToDisk: true,
    publicPath: true,
    customize: ({ key, value }) => {
      if (key.toLowerCase().endsWith('.map')) return false;
      return { key, value };
    } }),

  new _webpack.default.DllPlugin({
    context: root,
    path: _path.default.join(outputPath, '../static/dll-manifest.json'),
    name: "[name]_[hash:8]" })] },


(0, _webpack2.getMergeConfig)(builder, jsRules));exports.default = _default;