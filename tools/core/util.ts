import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { isEmpty } from 'lodash';

const factoryUse = (loader: string, options: any, mergeOption?: any): any => ({
  loader,
  options: Object.assign({}, options, mergeOption || {}),
});

const factoryRules = (regExp: RegExp, options: any = {}) => (use: any[]) => Object.keys(options).reduce((o: object, key: string) => Object.assign(o, options[key] ? {
  [key]: options[key],
} : {}), {
  test: regExp,
  use,
});

const factoryLoaders = (loader: any, mergeOption?: any): any[] => (loader || []).map((loader: string | string[]) => {
  const [l, options = {}] = Array.isArray(loader) ? loader : [loader];
  return factoryUse(l, options, mergeOption);
});

const factoryConcatUse = (defaultUse: any[] | any) => (loader: string[], mergeOption?: any): any[] => {
  return (Array.isArray(defaultUse) ? defaultUse : defaultUse ? [defaultUse] : []).concat(factoryLoaders(loader, mergeOption));
}

export function jsLoader(config: any): any {
  const { options = {}, exclude = /node_modules/, include } = config;
  const concatBabelUse = factoryConcatUse(factoryUse('babel-loader', options));
  const factory = (regExp: RegExp, loader?: string[], isNoBabelLoader?: boolean) => (_regExp?: any, mergeOption?: any) => {
    const concatUse = isNoBabelLoader ? factoryConcatUse([]) : concatBabelUse;
    if (_regExp instanceof RegExp) {
      regExp = _regExp;
    } else {
      mergeOption = _regExp;
    }
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    return factory(concatUse(loader || [], loaderOption || {}));
  }

  return {
    babel: factory(/\.(js|jsx)$/),
    ts: factory(/\.(ts|tsx)$/, ['ts-loader']),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack'], true),
    ngOptimizerJs: factory(/\.(js)$/, ['@angular-devkit/build-optimizer/webpack-loader'], true)
  };
}


export function cssLoader(config: any, isNotExtract?: boolean) {
  const publicOptions = !isNotExtract ? {} : { sourceMap: true };
  const { options, exclude = /node_modules/, include, resources } = config;

  const preUse = factoryUse(!isNotExtract ? 'style-loader' : MiniCssExtractPlugin.loader, {});

  const concatUse = factoryConcatUse([
    factoryUse('css-loader', { modules: true, ...publicOptions, ...options }),
    factoryUse('postcss-loader', Object.assign({
      config: { path: path.join(__dirname, 'postcss.config.js') },
    }, !isNotExtract ? {} : { sourceMap: 'inline' })),
  ]);

  const factory = (regExp: RegExp, loader?: any[], defaultOptions?: object) => (mergeOption?: any, preLoader?: string) => {
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    let oneLoader;
    if (!isEmpty(loader)) {
      oneLoader = Array.isArray(loader[0]) ? loader[0] : [loader[0]];;
      oneLoader[1] = { ...defaultOptions, ...publicOptions, ...loaderOption };
      loader[0] = oneLoader;
    }
    const use = concatUse(loader || [], {});
    use.unshift(preLoader ? factoryUse(preLoader, {}) : preUse);
    return factory(use);
  }

  return {
    css: factory(/\.(css)$/),
    less: factory(/\.(less)$/, ['less-loader']),
    sass: factory(/\.(sass|scss)$/, ['sass-loader', ['sass-resources-loader', {
      resources
    }]]),
    more: function (types: string[], options?: any, preLoader?: string) {
      return types.map((type: string) => this[type](options, preLoader));
    },
  }
}

export function fileLoader(config?: any) {
  const { options, exclude = /node_modules/, include, outputPath } = config || {};
  const factory = (regExp: RegExp, loader?: any[]) => (mergeOptions?: any) => {
    const [loadRex, options] = Array.isArray(loader) ? loader : [loader];
    const { exclude: lExclude = exclude, include: lInclude = include, ...loaderOption } = mergeOptions || {};
    const factory = factoryRules(regExp, { exclude: lExclude, include: lInclude });
    const use = factoryUse(loadRex, { outputPath, ...options, ...loaderOption });
    return factory(use);
  }

  return {
    image: factory(/\.(png|jpe?g|gif)$/i, ['file-loader', {}]),
    font: factory(/\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, ['file-loader', {}])
  };
}
