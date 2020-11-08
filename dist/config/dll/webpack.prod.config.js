"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _uglifyjsWebpackPlugin = _interopRequireDefault(require("uglifyjs-webpack-plugin"));
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));
var _config = _interopRequireDefault(require("../config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { isDebug } = _config.default;var _default =

() => (0, _webpackMerge.default)((0, _webpackBase.default)(), {
  optimization: {
    minimizer: [
    new _uglifyjsWebpackPlugin.default({
      sourceMap: isDebug,
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