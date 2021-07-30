"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _webpack = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = require("../config");
var _circularDependencyPlugin = _interopRequireDefault(require("circular-dependency-plugin"));function _getRequireWildcardCache(nodeInterop) {if (typeof WeakMap !== "function") return null;var cacheBabelInterop = new WeakMap();var cacheNodeInterop = new WeakMap();return (_getRequireWildcardCache = function (nodeInterop) {return nodeInterop ? cacheNodeInterop : cacheBabelInterop;})(nodeInterop);}function _interopRequireWildcard(obj, nodeInterop) {if (!nodeInterop && obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache(nodeInterop);if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const jsRules = (0, _util.jsLoader)({ options: _config.babellrc });

const {
  root,
  main,
  assets,
  outputPath,
  nodeExternals,
  tsConfig,
  builder } =
(0, _config.platformConfig)(_config.PlatformEnum.server);

const _mergeServerConfig = (0, _webpack.getMergeConfig)(builder, jsRules) || {};var _default =

() => (0, _webpackMerge.default)(_webpack.default, {
  target: 'node',
  context: root,
  entry: main && { server: main } || {},
  output: {
    path: outputPath,
    chunkFilename: `[name].[chunkhash:8].js`,
    filename: `[name].js`,
    library: 'commonjs2' },

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    plugins: [new TsconfigPathsPlugin({})] },

  externals: nodeExternals !== false ? [(0, _webpackNodeExternals.default)()] : [],
  module: {
    rules: [
    jsRules.babel(),
    jsRules.ts({
      transpileOnly: true,
      context: root,
      configFile: tsConfig })] },



  plugins: [
  ...(0, _webpack.copyPlugin)(assets, outputPath, root),
  new _circularDependencyPlugin.default({
    exclude: /node_modules/,
    failOnError: true,
    allowAsyncCycles: false,
    cwd: root })],


  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false } },

_mergeServerConfig);exports.default = _default;