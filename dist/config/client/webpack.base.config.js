"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpack = require("webpack");
var _webpackAssetsManifest = _interopRequireDefault(require("webpack-assets-manifest"));
var _fs = require("fs");
var _webpack2 = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = require("../config");function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { presets, plugins } = _config.babellrc;

const cssRules = (0, _util.cssLoader)({}, _config.isDebug);
const jsRules = (0, _util.jsLoader)({
  options: {
    presets: [
    ["@babel/preset-env", {
      "targets": _config.browserslist }],

    ...(presets || []).slice(1)],

    plugins: plugins || [] } });var _default =



() => (0, _webpackMerge.default)(_webpack2.default, {
  target: 'web',
  context: _config.baseDir,
  entry: {
    main: _path.default.resolve(_config.srcDir, 'client/main.ts') },

  output: {
    publicPath: '',
    path: _path.default.join(_config.buildDir, 'public'),
    chunkFilename: `check/[name].[chunkhash:8].js`,
    filename: `javascript/[name].[hash:8].js` },

  resolve: {
    symlinks: true,
    modules: [_path.default.resolve(_config.baseDir, 'node_modules'), _path.default.relative(_config.baseDir, 'src')],
    extensions: ['.ts', '.tsx', '.mjs', '.js'] },

  module: {
    rules: [] },

  plugins: [
  new _webpack.ProgressPlugin(),
  ...(0, _webpack2.copyPlugin)(_path.default.join(_config.baseDir, 'public'), _path.default.join(_config.buildDir, 'public')),
  new _webpackAssetsManifest.default({
    output: `${_config.buildDir}/assets.json`,
    writeToDisk: true,
    publicPath: true,
    customize: ({ key, value }) => {
      if (key.toLowerCase().endsWith('.map')) return false;
      return { key, value };
    } }),

  ...((0, _fs.existsSync)(`${_config.buildDir}/static/dll-manifest.json`) ? [
  new _webpack.DllReferencePlugin({
    context: _config.baseDir,
    manifest: require(`${_config.buildDir}/static/dll-manifest.json`) })] :

  [])] },

(0, _webpack2.getMergeConfig)(`webpack.client.js`, jsRules, cssRules));exports.default = _default;