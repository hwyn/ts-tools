"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = require("webpack");
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _uglifyjsWebpackPlugin = _interopRequireDefault(require("uglifyjs-webpack-plugin"));
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { isDevelopment } = (0, _config.platformConfig)();var _default =

() => (0, _webpackMerge.default)((0, _webpackBase.default)(), {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true },

        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true } } },



    minimizer: [
    new _webpack.HashedModuleIdsPlugin(),
    new _uglifyjsWebpackPlugin.default({
      sourceMap: isDevelopment,
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
          inline: 3 } } })] } });exports.default = _default;