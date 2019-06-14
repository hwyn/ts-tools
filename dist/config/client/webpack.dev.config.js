"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _webpack = _interopRequireDefault(require("webpack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _happypack = _interopRequireDefault(require("happypack"));
var _webpackBase = _interopRequireDefault(require("./webpack.base.config"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const hotPlug = key => `webpack-hot-middleware/client?name=${key}&reload=true`;var _default =

() => {
  const config = (0, _webpackBase.default)();
  const rules = config.module.rules;
  const _rules = [];
  const _plugins = [];
  rules.forEach((rule, index) => {
    const { use, ...__rules } = rule;
    const id = `happypack${index}`;
    _rules.push({
      ...__rules,
      use: `happypack/loader?id=${id}` });

    _plugins.push(new _happypack.default({
      id,
      threads: index + 1,
      loaders: use }));

  });

  const entry = config.entry;
  delete config.entry;
  delete config.module.rules;
  console.log(rules);
  console.log(_rules);
  console.log(_plugins);
  return (0, _webpackMerge.default)(config, {
    mode: 'development',
    entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
      [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [entry[key], hotPlug(key)] }),
    {}),
    output: {
      filename: config.output.filename.replace('\.[hash:8]', '') },

    module: {
      rules: _rules },

    plugins: [
    ..._plugins,
    new _webpack.default.HotModuleReplacementPlugin(),
    new _webpack.default.NoEmitOnErrorsPlugin(),
    new _webpack.default.DefinePlugin({
      'process.env.NODE_ENV': "'development'" })],


    devtool: 'source-map' });

};exports.default = _default;