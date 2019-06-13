"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpack = require("webpack");
var _extractTextWebpackPlugin = _interopRequireDefault(require("extract-text-webpack-plugin"));
var _assetsWebpackPlugin = _interopRequireDefault(require("assets-webpack-plugin"));
var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));
var _fs = require("../../core/fs");
var _util = require("../../core/util");
var _config = _interopRequireDefault(require("../config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { srcDir, baseDir, buildDir, babellrc, browserslist, isDebug } = _config.default;
const mergeClientConfig = (0, _fs.requireSync)(`${baseDir}/webpack.client.js`);

const assetsPlugin = new _assetsWebpackPlugin.default({
  filename: 'assets.json',
  path: buildDir,
  prettyPrint: true,
  update: true });

const copyPlugin = new _copyWebpackPlugin.default([{ from: _path.default.join(baseDir, 'public'), to: _path.default.join(buildDir, 'public') }]);
const { presets, plugins } = babellrc;
const jsRules = (0, _util.jsLoader)({
  options: {
    presets: [
    ["@babel/preset-env", {
      "targets": browserslist }],

    ...(presets || []).slice(1)],

    plugins: [
    ...(plugins || [])] } });




const extractLess = new _extractTextWebpackPlugin.default(`styleSheet/[name]less.[hash:8].css`);
const extractScss = new _extractTextWebpackPlugin.default(`styleSheet/[name]scss.[hash:8].css`);
const extractOther = new _extractTextWebpackPlugin.default(`styleSheet/[name]css.[hash:8].css`);
const cssRules = (0, _util.cssLoader)({}, isDebug);

const _mergeClientConfig = (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig)(jsRules, cssRules, {
  extractLess,
  extractScss,
  extractOther },
isDebug);var _default =

() => (0, _webpackMerge.default)({
  context: baseDir,
  target: 'web',
  entry: {
    main: _path.default.resolve(srcDir, 'client/main.ts') },

  output: {
    publicPath: '',
    path: _path.default.join(buildDir, 'public'),
    chunkFilename: `check/[name].[chunkhash:8].js`,
    filename: `javascript/[name].[hash:8].js` },

  resolve: {
    modules: [_path.default.resolve(baseDir, 'node_modules'), _path.default.relative(baseDir, 'src')],
    extensions: ['.js', '.ts'] },

  module: {
    rules: [
    jsRules.babel({}),
    jsRules.ts({
      transpileOnly: true,
      context: baseDir,
      configFile: 'ts.client.json' }),

    cssRules.less({
      javascriptEnabled: true },
    extractLess)] },


  plugins: [
  copyPlugin,
  extractLess,
  extractScss,
  extractOther,
  new _webpack.ProgressPlugin(),
  assetsPlugin],

  stats: {
    colors: true,
    timings: true } },

_mergeClientConfig);exports.default = _default;