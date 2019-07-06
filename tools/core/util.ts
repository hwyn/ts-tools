import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const factoryUse = (loader: string, options: any, mergeOption?: any): any => ({
  loader,
  options: Object.assign({}, options, mergeOption || {}),
});

const factoryRules = (regExp: RegExp, options: any = {}) => (use: any[]) => Object.keys(options).reduce((o: object, key: string) => Object.assign(o, options[key] ? {
  [key]: options[key],
}: { }), {
  test: regExp,
  use,
});

const factoryLoaders = (loader: any, mergeOption?: any): any[] => (loader || []).map((loader: string) => ({
  loader: `${loader}`,
  options: mergeOption,
}));

const factoryConcatUse = (defaultUse: any[] | any) => (loader: string[], mergeOption?: any): any[] => {
  return (Array.isArray(defaultUse) ? defaultUse : defaultUse ? [defaultUse] : []).concat(factoryLoaders(loader, mergeOption));
}

export function jsLoader(config: any) {
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
    ngOptimizerJs: factory(/\.(js)$/, ['@angular-devkit/build-optimizer/webpack-loader'], true),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack'], true),
  };
}


export function cssLoader(config: any, isNotExtract?: boolean) {
  const publicOptions = !isNotExtract ? {} : { sourceMap: true };
  const { options, exclude = /node_modules/, include } = config;
  const preUse = factoryUse(isNotExtract ? 'style-loader' : MiniCssExtractPlugin.loader, {});
  const concatUse = factoryConcatUse([
    factoryUse('css-loader', { ...publicOptions, ...options }),
    factoryUse('postcss-loader', Object.assign({
      config: { path: path.join(__dirname, 'postcss.config.js') },
    }, !isNotExtract ? {} : { sourceMap: 'inline'})),
  ]);

  const factory = (regExp: RegExp, loader?: string[], defaultOptions?: object) => (mergeOption?: any, preLoader?: string) => {
    const { exclude: cExclude = exclude, include: cInclude = include, ...loaderOption } = mergeOption || {};
    const factory = factoryRules(regExp, { exclude: cExclude, include: cInclude });
    const use = concatUse(loader || [], { ...defaultOptions, ...publicOptions, ...loaderOption });
    use.unshift(preLoader ? factoryUse(preLoader, {}) : preUse);
    return factory(use);
  }

  return {
    css: factory(/\.(css)$/),
    less: factory(/\.(less)$/, ['less-loader'], { javascriptEnabled: true }),
    sass: factory(/\.(sass|scss)$/, ['sass-loader']),
    more: function (types: string[], options?: any, preLoader?: string) {
      return types.map((type: string) => this[type](options, preLoader));
    },
  }
}


