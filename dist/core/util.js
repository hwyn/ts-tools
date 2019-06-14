"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.jsLoader = jsLoader;exports.cssLoader = cssLoader;var _path = _interopRequireDefault(require("path"));
var _extractTextWebpackPlugin = _interopRequireDefault(require("extract-text-webpack-plugin"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const factoryUse = (loader, options, mergeOption) => ({
  loader,
  options: Object.assign({}, options, mergeOption || {}) });


const factoryRules = (regExp, options = {}) => use => Object.keys(options).reduce((o, key) => Object.assign(o, options[key] ? {
  [key]: options[key] } :
{}), {
  test: regExp,
  use });


const factoryLoaders = (loader, mergeOption) => (loader || []).map(loader => ({
  loader: `${loader}`,
  options: mergeOption }));


const factoryConcatUse = defaultUse => (loader, mergeOption) => {
  return (Array.isArray(defaultUse) ? defaultUse : defaultUse ? [defaultUse] : []).concat(factoryLoaders(loader, mergeOption));
};

function jsLoader(config) {
  const { options = {}, exclude = /node_modules/, include } = config;
  const concatUse = factoryConcatUse(factoryUse('babel-loader', options));
  const factory = (regExp, loader) => (_regExp, mergeOption) => {
    if (_regExp instanceof RegExp) {
      regExp = _regExp;
    } else {
      mergeOption = _regExp;
    }
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    return factory(concatUse(loader || [], loaderOption || {}));
  };

  return {
    babel: factory(/\.(js|jsx)$/),
    ts: factory(/\.(ts|tsx)/, ['ts-loader']),
    ngJs: factory(/\.(js)/, ['@angular-devkit/build-optimizer/webpack-loader']),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack']) };

}


function cssLoader(config, isExtract) {
  const { options, exclude = /node_modules/, include } = config;
  const styleUse = factoryUse('style-loader', {});
  const concatUse = factoryConcatUse([
  factoryUse('css-loader', options),
  factoryUse('postcss-loader', { config: { path: _path.default.join(__dirname, 'postcss.config.js') } })]);


  const factory = (regExp, loader) => (mergeOption, extractTextPlugin) => {
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    let use = concatUse(loader || [], loaderOption);
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