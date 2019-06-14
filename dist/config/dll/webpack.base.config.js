"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _webpack = _interopRequireWildcard(require("webpack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _assetsWebpackPlugin = _interopRequireDefault(require("assets-webpack-plugin"));
var _extractTextWebpackPlugin = _interopRequireDefault(require("extract-text-webpack-plugin"));
var _util = require("../../core/util");
var _fs = require("../../core/fs");
var _config = _interopRequireDefault(require("../config"));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { baseDir, buildDir, browserslist, babellrc: { presets, plugins }, isDebug } = _config.default;
const mergeDllConfig = (0, _fs.requireSync)(`${baseDir}/webpack.dll.js`);

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
const cssRules = (0, _util.cssLoader)({});
const _mergeDllConfig = (typeof mergeDllConfig === 'function' ? mergeDllConfig : () => mergeDllConfig)(jsRules, cssRules, {
  extractLess,
  extractScss,
  extractOther },
isDebug);
const assetsPlugin = new _assetsWebpackPlugin.default({
  filename: 'dll.json',
  path: buildDir,
  prettyPrint: true,
  update: true });var _default =


() => (0, _webpackMerge.default)({
  context: baseDir,
  target: 'web',
  entry: {},
  output: {
    path: _path.default.join(buildDir, 'public'),
    filename: 'javascript/dll_[name].js',
    library: "[name]_[hash:8]" },

  module: {
    rules: [
    jsRules.babel({}),
    jsRules.ts({
      happyPackMode: true,
      transpileOnly: true,
      context: baseDir,
      configFile: 'ts.client.json' }),

    cssRules.less({
      javascriptEnabled: true },
    extractLess),
    cssRules.css({}, extractOther)] },


  plugins: [
  assetsPlugin,
  extractLess,
  extractScss,
  extractOther,
  new _webpack.ProgressPlugin(),
  new _webpack.default.DllPlugin({
    path: _path.default.join(buildDir, "dll-manifest.json"),
    name: "[name]_[hash:8]" })],


  stats: {
    colors: true,
    timings: true } },

_mergeDllConfig);exports.default = _default;