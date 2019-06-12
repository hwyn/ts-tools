"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.jsLoader = jsLoader;exports.cssLoader = cssLoader;var _path = _interopRequireDefault(require("path"));
var _extractTextWebpackPlugin = _interopRequireDefault(require("extract-text-webpack-plugin"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const compose = (fx, gx) => (...arg) => fx(gx.apply(undefined, arg));

const factoryUse = (loader, options, mergeOption) => ({
  loader,
  options: Object.assign({}, options, mergeOption || {}) });


const factoryRules = (regExp, options = {}) => use => ({
  test: regExp,
  exclude: options.exclude,
  include: options.include,
  use });


const factoryLoaders = (loader, mergeOption) => (loader || []).map(loader => ({
  loader: `${loader}`,
  options: mergeOption }));


const factoryConcatUse = defaultUse => (loader, mergeOption) => {
  return Array.isArray(defaultUse) ? defaultUse : [defaultUse].concat(factoryLoaders(loader, mergeOption));
};

function jsLoader(config) {
  const { options = {}, exclude = /node_modules/ } = config;
  const concatUse = factoryConcatUse(factoryUse('babel-loader', options));
  const factory = (regExp, loader) => (_regExp, mergeOption) => {
    if (_regExp instanceof RegExp) {
      regExp = _regExp;
    } else {
      mergeOption = _regExp;
    }
    const factory = factoryRules(regExp, { exclude });
    return factory(concatUse(loader || [], mergeOption || {}));
  };

  return {
    babel: factory(/\.(js|jsx)$/),
    ts: factory(/\.(ts|tsx)/, ['ts-loader']),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack']) };

}


function cssLoader(config, isExtract) {
  const { options, exclude = /node_modules/ } = config;
  const styleUse = factoryUse('style-loader', {});
  const concatUse = factoryConcatUse([
  factoryUse('css-loader', options),
  factoryUse('postcss-loader', { config: { path: _path.default.join(__dirname, 'postcss.config.js') } })]);


  const factory = (regExp, loader) => (mergeOption = {}, extractTextPlugin) => {
    const factory = factoryRules(regExp, { exclude });
    let use = concatUse(loader || [], mergeOption);
    if (isExtract) {
      use.unshift(styleUse);
    } else {
      use = (extractTextPlugin || _extractTextWebpackPlugin.default).extract({ fallback: 'style-loader', use });
    }
    return factory(use);
  };

  return {
    css: factory(/\.(css)/),
    less: factory(/\.(less)/, ['less-loader']),
    sass: factory(/\.(sass|scss)/, ['sass-loader']) };

}