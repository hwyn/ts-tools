"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpack = require("webpack");
var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));
var _webpack2 = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = _interopRequireDefault(require("../config"));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { baseDir, babellrc, isDebug, buildDir } = _config.default;
const jsRules = (0, _util.jsLoader)({ options: babellrc });
const cssRules = (0, _util.cssLoader)({}, isDebug);

const _mergeClientConfig = (0, _webpack2.getMergeConfig)(`webpack.server.entry.js`, jsRules, cssRules);var _default =

() => (0, _webpackMerge.default)(_webpack2.default, {
  target: 'node',
  entry: {},
  output: {
    publicPath: '',
    path: _path.default.join(buildDir, 'server'),
    chunkFilename: `check/[name].js`,
    filename: `[name].js`,
    libraryTarget: 'commonjs' },

  resolve: {
    symlinks: true,
    modules: [_path.default.resolve(baseDir, 'node_modules'), _path.default.relative(baseDir, 'src')],
    extensions: ['.ts', '.tsx', '.mjs', '.js'] },

  externals: [
  '../build/assets.json',
  (0, _webpackNodeExternals.default)()],

  module: {
    rules: [] },

  plugins: [
  new _webpack.ProgressPlugin()],

  node: false },
_mergeClientConfig);exports.default = _default;