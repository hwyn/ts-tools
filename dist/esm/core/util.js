import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { isEmpty } from 'lodash';
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
export function jsLoader(config) {
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
export function cssLoader(config, isExtract) {
    const publicOptions = !isExtract ? { sourceMap: true } : {};
    const { options, exclude, include, resources, styleLoaderOptions } = config;
    let preUse = !isExtract ? ['style-loader', { ...styleLoaderOptions }] : [MiniCssExtractPlugin.loader];
    const clone = (getConfig, _isExtract = isExtract) => cssLoader(getConfig ? getConfig(config) : config, _isExtract);
    const concatUse = factoryConcatUse([
        factoryUse('css-loader', { modules: true, ...publicOptions, ...options }),
        factoryUse('postcss-loader', Object.assign({
            postcssOptions: {
            // plugins: [['postcss-preset-env', {}]]
            }
        }, publicOptions)),
    ]);
    const factory = (regExp, loader, defaultOptions) => (mergeOption, preLoader) => {
        const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
        const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
        let oneLoader;
        if (!isEmpty(loader)) {
            oneLoader = Array.isArray(loader[0]) ? loader[0] : [loader[0]];
            oneLoader[1] = { ...defaultOptions, ...publicOptions, ...loaderOption };
            loader[0] = oneLoader;
        }
        const use = concatUse(loader || [], {});
        if (preLoader !== false) {
            if (preLoader) {
                preUse = Array.isArray(preLoader) ? preLoader : [preLoader, {}];
            }
            use.unshift(factoryUse(preUse[0], preUse[1] || {}));
        }
        return factory(use);
    };
    const sassLoader = ['sass-loader'];
    if (resources) {
        sassLoader.push(['sass-resources-loader', { resources }]);
    }
    return {
        clone,
        css: factory(/\.(css)$/),
        less: factory(/\.(less)$/, ['less-loader']),
        sass: factory(/\.(sass|scss)$/, sassLoader),
        more: function (types, options, preLoader) {
            return types.map((type) => this[type](options, preLoader));
        },
    };
}
export function assetResource(config) {
    const { generator: defaultGenerator } = config || {};
    const factory = (regExp, type) => (mergeOptions) => {
        const [loadRex, _options] = Array.isArray(type) ? type : [type];
        const { generator = defaultGenerator } = mergeOptions || {};
        return { test: regExp, type: loadRex, generator };
    };
    return {
        image: factory(/\.(png|jpe?g|gif)$/i, ['asset/resource', {}]),
        font: factory(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, ['asset/resource', {}])
    };
}
