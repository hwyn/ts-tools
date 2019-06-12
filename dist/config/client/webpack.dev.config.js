"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const hotPlug = key => `webpack-hot-middleware/client?name=${key}&reload=true`;var _default =

() => {
  const config = (0, _webpackBase.default)();
  const entry = config.entry;
  delete config.entry;
  return (0, _webpackMerge.default)(config, {
    mode: 'development',
    entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
      [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [entry[key], hotPlug(key)] }),
    {}),
    output: {
      filename: config.output.filename.replace('\.[hash:8]', '') },

    plugins: [
    new _webpack.default.HotModuleReplacementPlugin(),
    new _webpack.default.NoEmitOnErrorsPlugin()],

    devtool: 'source-map' });

};exports.default = _default;