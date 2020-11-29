"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.jsLoader = jsLoader;exports.cssLoader = cssLoader;var _path = _interopRequireDefault(require("path"));
var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));
var _lodash = require("lodash");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const factoryUse = (loader, options, mergeOption) => ({
  loader,
  options: Object.assign({}, options, mergeOption || {}) });


const factoryRules = (regExp, options = {}) => use => Object.keys(options).reduce((o, key) => Object.assign(o, options[key] ? {
  [key]: options[key] } :
{}), {
  test: regExp,
  use });


const factoryLoaders = (loader, mergeOption) => (loader || []).map(loader => {
  const [l, options = {}] = Array.isArray(loader) ? loader : [loader];
  return factoryUse(l, options, mergeOption);
});

const factoryConcatUse = defaultUse => (loader, mergeOption) => {
  return (Array.isArray(defaultUse) ? defaultUse : defaultUse ? [defaultUse] : []).concat(factoryLoaders(loader, mergeOption));
};

function jsLoader(config) {
  const { options = {}, exclude = /node_modules/, include } = config;
  const concatBabelUse = factoryConcatUse(factoryUse('babel-loader', options));
  const factory = (regExp, loader, isNoBabelLoader) => (_regExp, mergeOption) => {
    const concatUse = isNoBabelLoader ? factoryConcatUse([]) : concatBabelUse;
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
    ts: factory(/\.(ts|tsx)$/, ['ts-loader']),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack'], true),
    ngOptimizerJs: factory(/\.(js)$/, ['@angular-devkit/build-optimizer/webpack-loader'], true) };

}


function cssLoader(config, isNotExtract) {
  const publicOptions = !isNotExtract ? {} : { sourceMap: true };
  const { options, exclude = /node_modules/, include, resources } = config;
  const preUse = factoryUse(isNotExtract ? 'style-loader' : _miniCssExtractPlugin.default.loader, {});
  const concatUse = factoryConcatUse([
  factoryUse('css-loader', { modules: true, ...publicOptions, ...options }),
  factoryUse('postcss-loader', Object.assign({
    config: { path: _path.default.join(__dirname, 'postcss.config.js') } },
  !isNotExtract ? {} : { sourceMap: 'inline' }))]);


  const factory = (regExp, loader, defaultOptions) => (mergeOption, preLoader) => {
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    let oneLoader;
    if (!(0, _lodash.isEmpty)(loader)) {
      oneLoader = Array.isArray(loader[0]) ? loader[0] : [loader[0]];;
      oneLoader[1] = { ...defaultOptions, ...publicOptions, ...loaderOption };
      loader[0] = oneLoader;
    }
    const use = concatUse(loader || [], {});
    use.unshift(preLoader ? factoryUse(preLoader, {}) : preUse);
    return factory(use);
  };

  return {
    css: factory(/\.(css)$/),
    less: factory(/\.(less)$/, ['less-loader']),
    sass: factory(/\.(sass|scss)$/, ['sass-loader', ['sass-resources-loader', {
      resources }]]),

    more: function (types, options, preLoader) {
      return types.map(type => this[type](options, preLoader));
    } };

}