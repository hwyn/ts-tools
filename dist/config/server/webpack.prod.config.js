"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _config = require("../config");
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { tsConfig } = (0, _config.platformConfig)(_config.PlatformEnum.server);var _default =

() => {
  process.env.TS_NODE_PROJECT = tsConfig;
  return (0, _webpackMerge.default)((0, _webpackBase.default)(), {});
};exports.default = _default;