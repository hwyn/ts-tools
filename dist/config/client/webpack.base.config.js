"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpack = require("webpack");
var _assetsWebpackPlugin = _interopRequireDefault(require("assets-webpack-plugin"));
var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));
var _fs = require("fs");
var _webpack2 = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = _interopRequireDefault(require("../config"));function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { srcDir, baseDir, buildDir, babellrc: { presets, plugins }, browserslist, isDebug } = _config.default;
const copyPlugin = new _copyWebpackPlugin.default({ patterns: [{ from: _path.default.join(baseDir, 'public'), to: _path.default.join(buildDir, 'public') }] });

const cssRules = (0, _util.cssLoader)({}, isDebug);
const jsRules = (0, _util.jsLoader)({
  options: {
    presets: [
    ["@babel/preset-env", {
      "targets": browserslist }],

    ...(presets || []).slice(1)],

    plugins: plugins || [] } });



const _mergeClientConfig = (0, _webpack2.getMergeConfig)(`webpack.client.js`, jsRules, cssRules);var _default =

() => (0, _webpackMerge.default)(_webpack2.default, {
  target: 'web',
  context: baseDir,
  entry: {
    main: _path.default.resolve(srcDir, 'client/main.ts') },

  output: {
    publicPath: '',
    path: _path.default.join(buildDir, 'public'),
    chunkFilename: `check/[name].[chunkhash:8].js`,
    filename: `javascript/[name].[hash:8].js` },

  resolve: {
    symlinks: true,
    modules: [_path.default.resolve(baseDir, 'node_modules'), _path.default.relative(baseDir, 'src')],
    extensions: ['.ts', '.tsx', '.mjs', '.js'] },

  module: {
    rules: [] },

  plugins: [
  new _webpack.ProgressPlugin(),
  copyPlugin,
  new _assetsWebpackPlugin.default({
    filename: 'assets.json',
    path: buildDir,
    prettyPrint: true,
    update: true }),

  ...((0, _fs.existsSync)(`${buildDir}/static/dll-manifest.json`) ? [
  new _webpack.DllReferencePlugin({
    context: baseDir,
    manifest: require(`${buildDir}/static/dll-manifest.json`) })] :

  [])] },

_mergeClientConfig);exports.default = _default;