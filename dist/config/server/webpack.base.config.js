"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpackNodeExternals = _interopRequireDefault(require("webpack-node-externals"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _path = _interopRequireDefault(require("path"));
var _webpack = _interopRequireWildcard(require("../base/webpack.config"));
var _util = require("../../core/util");
var _config = _interopRequireDefault(require("../config"));function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { srcDir, baseDir, buildDir, babellrc } = _config.default;
const jsRules = (0, _util.jsLoader)({ options: babellrc });
const _mergeServerConfig = (0, _webpack.getMergeConfig)(`webpack.server.js`, jsRules, undefined);var _default =

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

  externals: [
  (0, _webpackNodeExternals.default)()],

  module: {
    rules: [
    jsRules.babel(),
    jsRules.ts({
      transpileOnly: true,
      context: baseDir,
      configFile: 'tsconfig.json' })] },



  plugins: [],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false } },

_mergeServerConfig);exports.default = _default;