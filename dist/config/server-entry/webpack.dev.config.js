"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _happypack = require("../../core/happypack");
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =

() => {
  const config = (0, _webpackBase.default)();
  return (0, _happypack.happypackMerge)((0, _webpackMerge.default)(config, {
    mode: 'development',
    watch: true,
    devtool: false }));

};exports.default = _default;