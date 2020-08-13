"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _path = _interopRequireDefault(require("path"));
var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));
var _webpack = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = _interopRequireDefault(require("../config"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { srcDir, baseDir, buildDir, babellrc } = _config.default;
const jsRules = (0, _util.jsLoader)({ options: babellrc });
const _mergeServerConfig = (0, _webpack.getMergeConfig)(`webpack.server.js`, jsRules, undefined) || {};
const copyPlugin = new _copyWebpackPlugin.default([{ from: _path.default.join(baseDir, '.env'), to: _path.default.join(buildDir, '.env') }]);var _default =

() => (0, _webpackMerge.default)(_webpack.default, {
  target: 'node',
  entry: _mergeServerConfig && _mergeServerConfig.entry ? _mergeServerConfig.entry : {
    server: _path.default.resolve(srcDir, 'server/index.ts') },

  output: {
    path: buildDir,
    chunkFilename: `[name].check.[hash:8].js`,
    filename: `[name].js`,
    library: 'commonjs2' },

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] },

  externals: _mergeServerConfig.isNodExternals !== false ? [
  (0, _webpackNodeExternals.default)()] :
  [],
  module: {
    rules: [
    jsRules.babel(),
    jsRules.ts({
      transpileOnly: true,
      context: baseDir,
      configFile: 'tsconfig.json' })] },



  plugins: [copyPlugin],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false } },

(0, _webpack.filterAttr)(_mergeServerConfig, ['isNodExternals']));exports.default = _default;