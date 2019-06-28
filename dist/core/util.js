"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.jsLoader = jsLoader;exports.cssLoader = cssLoader;var _path = _interopRequireDefault(require("path"));
var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

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
    ngOptimizerJs: factory(/\.(js)$/, ['@angular-devkit/build-optimizer/webpack-loader'], true),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack'], true) };

}


function cssLoader(config, isNotExtract) {
  const publicOptions = !isNotExtract ? {} : { sourceMap: true };
  const { options, exclude = /node_modules/, include } = config;
  const preUse = factoryUse(isNotExtract ? 'style-loader' : _miniCssExtractPlugin.default.loader, {});
  const concatUse = factoryConcatUse([
  factoryUse('css-loader', { ...publicOptions, ...options }),
  factoryUse('postcss-loader', Object.assign({
    config: { path: _path.default.join(__dirname, 'postcss.config.js') } },
  !isNotExtract ? {} : { sourceMap: 'inline' }))]);


  const factory = (regExp, loader, defaultOptions) => (mergeOption, preLoader) => {
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    const use = concatUse(loader || [], { ...defaultOptions, ...publicOptions, ...loaderOption });
    use.unshift(preLoader ? factoryUse(preLoader, {}) : preUse);
    return factory(use);
  };

  return {
    css: factory(/\.(css)$/),
    less: factory(/\.(less)$/, ['less-loader'], { javascriptEnabled: true }),
    sass: factory(/\.(sass|scss)$/, ['sass-loader']),
    more: function (types, options) {
      return types.map(type => this[type](options));
    } };

}