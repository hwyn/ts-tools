"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpack = require("webpack");
var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));
var _webpack2 = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = require("../config");function _getRequireWildcardCache(nodeInterop) {if (typeof WeakMap !== "function") return null;var cacheBabelInterop = new WeakMap();var cacheNodeInterop = new WeakMap();return (_getRequireWildcardCache = function (nodeInterop) {return nodeInterop ? cacheNodeInterop : cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj, nodeInterop) {if (!nodeInterop && obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache(nodeInterop);if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { entry, builder, isDevelopment, outputPath, themeVariable, nodeModules, sourceRoot } = (0, _config.platformConfig)(_config.PlatformEnum.serverEntry);
const jsRules = (0, _util.jsLoader)({ options: _config.babellrc });
const cssRules = (0, _util.cssLoader)({
  ...(themeVariable ? { resources: themeVariable } : {}),
  options: {
    modules: {
      localIdentName: `[hash:base64:5]` } } },


!isDevelopment);var _default =

() => (0, _webpackMerge.default)(_webpack2.default, {
  target: 'node',
  entry,
  output: {
    publicPath: '',
    path: outputPath,
    chunkFilename: `check/[name].js`,
    filename: `[name].js`,
    libraryTarget: 'commonjs' },

  resolve: {
    symlinks: true,
    modules: [nodeModules, sourceRoot],
    extensions: ['.ts', '.tsx', '.mjs', '.js'] },

  externals: [
  `${outputPath}/assets.json`,
  (0, _webpackNodeExternals.default)()],

  module: {
    rules: [] },

  plugins: [
  new _webpack.ProgressPlugin()],

  node: false },
(0, _webpack2.getMergeConfig)(builder, jsRules, cssRules));exports.default = _default;