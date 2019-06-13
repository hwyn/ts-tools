"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _path = _interopRequireDefault(require("path"));
var _fs = require("../../core/fs");
var _util = require("../../core/util");
var _config = _interopRequireDefault(require("../config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { srcDir, baseDir, buildDir, babellrc, isDebug } = _config.default;
const mergeServerConfig = (0, _fs.requireSync)(`${baseDir}/webpack.server.js`) || {};
const jsRules = (0, _util.jsLoader)({ options: babellrc });

const _mergeServerConfig = (typeof mergeServerConfig === 'function' ? mergeServerConfig : () => mergeServerConfig)(jsRules, undefined, isDebug);var _default =

() => (0, _webpackMerge.default)({
  context: baseDir,
  target: 'node',
  entry: {
    index: _path.default.resolve(srcDir, 'server/index.ts') },

  output: {
    path: buildDir,
    chunkFilename: `server/[name].check.[hash:8].js`,
    filename: `server/[name].js`,
    library: 'commonjs2' },

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'] },

  externals: [
  '../build/assets.json',
  (0, _webpackNodeExternals.default)()],

  module: {
    rules: [
    jsRules.babel(),
    jsRules.ts({
      transpileOnly: true,
      context: baseDir,
      configFile: 'ts.server.json' })] },



  plugins: [],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false },

  stats: {
    colors: true,
    timings: true } },

_mergeServerConfig);exports.default = _default;