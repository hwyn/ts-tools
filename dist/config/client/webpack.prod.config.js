"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireWildcard(require("webpack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _uglifyjsWebpackPlugin = _interopRequireDefault(require("uglifyjs-webpack-plugin"));
var _fs = require("fs");
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));
var _config = _interopRequireDefault(require("../config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}

const { buildDir, baseDir } = _config.default;var _default =

() => (0, _webpackMerge.default)((0, _webpackBase.default)(), {
  mode: 'production',
  optimization: {
    noEmitOnErrors: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'async',
          minChunks: 2,
          priority: 10 },

        common: {
          name: 'common',
          chunks: 'async',
          minChunks: 2,
          enforce: true,
          priority: 5 },

        vendors: false,
        vendor: false } },


    minimizer: [
    new _webpack.HashedModuleIdsPlugin(),
    new _uglifyjsWebpackPlugin.default({
      sourceMap: true,
      cache: true,
      parallel: true,
      uglifyOptions: {
        safari10: true,
        output: {
          ascii_only: true,
          comments: false,
          webkit: true },

        compress: {
          pure_getters: true,
          passes: 3,
          inline: 3 } } })] },





  plugins: [
  new _webpack.default.DefinePlugin({
    'process.env.NODE_ENV': "'production'" }),

  ...((0, _fs.existsSync)(`${buildDir}/dll-manifest.json`) ? [
  new _webpack.DllReferencePlugin({
    context: baseDir,
    manifest: require(`${buildDir}/dll-manifest.json`) })] :

  [])] });exports.default = _default;