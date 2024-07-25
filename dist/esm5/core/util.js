import { __assign, __rest } from "tslib";
import { isEmpty } from 'lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
var factoryUse = function (loader, options, mergeOption) { return ({
    loader: loader,
    options: Object.assign({}, options, mergeOption || {}),
}); };
var factoryRules = function (regExp, options) {
    if (options === void 0) { options = {}; }
    return function (use) { return Object.keys(options).reduce(function (o, key) {
        var _a;
        return Object.assign(o, options[key] ? (_a = {},
            _a[key] = options[key],
            _a) : {});
    }, {
        test: regExp,
        use: use,
    }); };
};
var factoryLoaders = function (loader, mergeOption) { return (loader || []).map(function (loader) {
    var _a = Array.isArray(loader) ? loader : [loader], l = _a[0], _b = _a[1], options = _b === void 0 ? {} : _b;
    return factoryUse(l, options, mergeOption);
}); };
var factoryConcatUse = function (defaultUse) { return function (loader, mergeOption) {
    return (Array.isArray(defaultUse) ? defaultUse : defaultUse ? [defaultUse] : []).concat(factoryLoaders(loader, mergeOption));
}; };
export function jsLoader(config) {
    var _a = config.options, options = _a === void 0 ? {} : _a, _b = config.exclude, exclude = _b === void 0 ? /node_modules/ : _b, include = config.include;
    var concatBabelUse = factoryConcatUse(factoryUse('babel-loader', options));
    var factory = function (regExp, loader, isNoBabelLoader) { return function (_regExp, mergeOption) {
        var concatUse = isNoBabelLoader ? factoryConcatUse([]) : concatBabelUse;
        if (_regExp instanceof RegExp) {
            regExp = _regExp;
        }
        else {
            mergeOption = _regExp;
        }
        var _a = mergeOption || {}, _b = _a.exclude, cExclude = _b === void 0 ? exclude : _b, _c = _a.include, cInclude = _c === void 0 ? include : _c, loaderOption = __rest(_a, ["exclude", "include"]);
        var factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
        return factory(concatUse(loader || [], loaderOption || {}));
    }; };
    return {
        babel: factory(/\.(js|jsx)$/),
        ts: factory(/\.(ts|tsx)$/, ['ts-loader'])
    };
}
export function cssLoader(config, isExtract) {
    var publicOptions = !isExtract ? { sourceMap: true } : {};
    var options = config.options, exclude = config.exclude, include = config.include, resources = config.resources, styleLoaderOptions = config.styleLoaderOptions;
    var preUse = !isExtract ? ['style-loader', __assign({}, styleLoaderOptions)] : [MiniCssExtractPlugin.loader];
    var clone = function (getConfig, _isExtract) {
        if (_isExtract === void 0) { _isExtract = isExtract; }
        return cssLoader(getConfig ? getConfig(config) : config, _isExtract);
    };
    var concatUse = factoryConcatUse([
        factoryUse('css-loader', __assign(__assign({ modules: true }, publicOptions), options)),
        factoryUse('postcss-loader', Object.assign({ postcssOptions: {} }, publicOptions)),
    ]);
    var factory = function (regExp, loader, defaultOptions) { return function (mergeOption, preLoader) {
        var _a = mergeOption || {}, _b = _a.exclude, cExclude = _b === void 0 ? exclude : _b, _c = _a.include, cInclude = _c === void 0 ? include : _c, loaderOption = __rest(_a, ["exclude", "include"]);
        var factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
        var oneLoader;
        if (!isEmpty(loader)) {
            oneLoader = Array.isArray(loader[0]) ? loader[0] : [loader[0]];
            oneLoader[1] = __assign(__assign(__assign({}, defaultOptions), publicOptions), loaderOption);
            loader[0] = oneLoader;
        }
        var use = concatUse(loader || [], {});
        if (preLoader !== false) {
            if (preLoader) {
                preUse = Array.isArray(preLoader) ? preLoader : [preLoader, {}];
            }
            use.unshift(factoryUse(preUse[0], preUse[1] || {}));
        }
        return factory(use);
    }; };
    var sassLoader = ['sass-loader'];
    if (resources) {
        sassLoader.push(['sass-resources-loader', { resources: resources }]);
    }
    return {
        clone: clone,
        css: factory(/\.(css)$/),
        less: factory(/\.(less)$/, ['less-loader']),
        sass: factory(/\.(sass|scss)$/, sassLoader),
        more: function (types, options, preLoader) {
            var _this = this;
            return types.map(function (type) { return _this[type](options, preLoader); });
        },
    };
}
export function assetResource(config) {
    var defaultGenerator = (config || {}).generator;
    var factory = function (regExp, type) { return function (mergeOptions) {
        var _a = Array.isArray(type) ? type : [type], loadRex = _a[0], _options = _a[1];
        var _b = (mergeOptions || {}).generator, generator = _b === void 0 ? defaultGenerator : _b;
        return { test: regExp, type: loadRex, generator: generator };
    }; };
    return {
        image: factory(/\.(png|jpe?g|gif)$/i, ['asset/resource', {}]),
        font: factory(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, ['asset/resource', {}])
    };
}
