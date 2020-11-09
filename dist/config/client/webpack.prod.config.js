"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireWildcard(require("webpack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _uglifyjsWebpackPlugin = _interopRequireDefault(require("uglifyjs-webpack-plugin"));
var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function () {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || typeof obj !== "object" && typeof obj !== "function") {return { default: obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj.default = obj;if (cache) {cache.set(obj, newObj);}return newObj;}var _default =

() => (0, _webpackMerge.default)((0, _webpackBase.default)(), {
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
      sourceMap: _config.isDebug,
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

  new _miniCssExtractPlugin.default({
    filename: 'styleSheet/[name].[hash:8].css',
    chunkFilename: 'styleSheet/[name].[chunkhash:8].css' })] });exports.default = _default;