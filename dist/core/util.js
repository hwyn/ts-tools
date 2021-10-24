"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileLoader = exports.cssLoader = exports.jsLoader = void 0;
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const mini_css_extract_plugin_1 = (0, tslib_1.__importDefault)(require("mini-css-extract-plugin"));
const lodash_1 = require("lodash");
const factoryUse = (loader, options, mergeOption) => ({
    loader,
    options: Object.assign({}, options, mergeOption || {}),
});
const factoryRules = (regExp, options = {}) => (use) => Object.keys(options).reduce((o, key) => Object.assign(o, options[key] ? {
    [key]: options[key],
} : {}), {
    test: regExp,
    use,
});
const factoryLoaders = (loader, mergeOption) => (loader || []).map((loader) => {
    const [l, options = {}] = Array.isArray(loader) ? loader : [loader];
    return factoryUse(l, options, mergeOption);
});
const factoryConcatUse = (defaultUse) => (loader, mergeOption) => {
    return (Array.isArray(defaultUse) ? defaultUse : defaultUse ? [defaultUse] : []).concat(factoryLoaders(loader, mergeOption));
};
function jsLoader(config) {
    const { options = {}, exclude = /node_modules/, include } = config;
    const concatBabelUse = factoryConcatUse(factoryUse('babel-loader', options));
    const factory = (regExp, loader, isNoBabelLoader) => (_regExp, mergeOption) => {
        const concatUse = isNoBabelLoader ? factoryConcatUse([]) : concatBabelUse;
        if (_regExp instanceof RegExp) {
            regExp = _regExp;
        }
        else {
            mergeOption = _regExp;
        }
        const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
        const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
        return factory(concatUse(loader || [], loaderOption || {}));
    };
    return {
        babel: factory(/\.(js|jsx)$/),
        ts: factory(/\.(ts|tsx)$/, ['ts-loader'])
    };
}
exports.jsLoader = jsLoader;
function cssLoader(config, isNotExtract) {
    const publicOptions = !isNotExtract ? {} : { sourceMap: true };
    const { options, exclude = /node_modules/, include, resources } = config;
    const preUse = factoryUse(!isNotExtract ? 'style-loader' : mini_css_extract_plugin_1.default.loader, {});
    const concatUse = factoryConcatUse([
        factoryUse('css-loader', { modules: true, ...publicOptions, ...options }),
        factoryUse('postcss-loader', Object.assign({
            config: { path: path_1.default.join(__dirname, 'postcss.config.js') },
        }, !isNotExtract ? {} : { sourceMap: 'inline' })),
    ]);
    const factory = (regExp, loader, defaultOptions) => (mergeOption, preLoader) => {
        const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
        const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
        let oneLoader;
        if (!(0, lodash_1.isEmpty)(loader)) {
            oneLoader = Array.isArray(loader[0]) ? loader[0] : [loader[0]];
            ;
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
                    resources
                }]]),
        more: function (types, options, preLoader) {
            return types.map((type) => this[type](options, preLoader));
        },
    };
}
exports.cssLoader = cssLoader;
function fileLoader(config) {
    const { options, exclude = /node_modules/, include, outputPath } = config || {};
    const factory = (regExp, loader) => (mergeOptions) => {
        const [loadRex, options] = Array.isArray(loader) ? loader : [loader];
        const { exclude: lExclude = exclude, include: lInclude = include, ...loaderOption } = mergeOptions || {};
        const factory = factoryRules(regExp, { exclude: lExclude, include: lInclude });
        const use = factoryUse(loadRex, { outputPath, ...options, ...loaderOption });
        return factory(use);
    };
    return {
        image: factory(/\.(png|jpe?g|gif)$/i, ['file-loader', {}]),
        font: factory(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, ['file-loader', {}])
    };
}
exports.fileLoader = fileLoader;
