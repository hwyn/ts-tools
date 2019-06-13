import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const compose = (fx: any, gx: any) => (...arg: any[]) => fx(gx.apply(undefined, arg));

const factoryUse = (loader: string, options: any, mergeOption?: any): any => ({
  loader,
  options: Object.assign({}, options, mergeOption || {}),
});

const factoryRules = (regExp: RegExp, options: any = {}) => (use: any[]) => ({
  test: regExp,
  exclude: options.exclude,
  include: options.include,
  use,
});

const factoryLoaders = (loader: any, mergeOption?: any): any[] => (loader || []).map((loader: string) => ({
  loader: `${loader}`,
  options: mergeOption,
}));

const factoryConcatUse = (defaultUse: any[] | any) => (loader: string[], mergeOption?: any): any[] => {
  return (Array.isArray(defaultUse) ? defaultUse : [defaultUse]).concat(factoryLoaders(loader, mergeOption));
}

export function jsLoader(config: any) {
  const { options = {}, exclude = /node_modules/ } = config;
  const concatUse = factoryConcatUse(factoryUse('babel-loader', options));
  const factory = (regExp: RegExp, loader?: string[]) => (_regExp?: any, mergeOption?: any) => {
    if (_regExp instanceof RegExp) {
      regExp = _regExp;
    } else {
      mergeOption = _regExp;
    }
    const factory = factoryRules(regExp, { exclude });
    return factory(concatUse(loader || [], mergeOption || {}));
  }

  return {
    babel: factory(/\.(js|jsx)$/),
    ts: factory(/\.(ts|tsx)/, ['ts-loader']),
    ngTs: factory(/(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/, ['@ngtools/webpack']),
  };
}


export function cssLoader(config: any, isExtract?: boolean) {
  const { options, exclude = /node_modules/ } = config;
  const styleUse = factoryUse('style-loader', {});
  const concatUse = factoryConcatUse([
    factoryUse('css-loader', options),
    factoryUse('postcss-loader', { config: { path: path.join(__dirname, 'postcss.config.js') } }),
  ]);

  const factory = (regExp: RegExp, loader?: string[]) => (mergeOption: any = {}, extractTextPlugin?: ExtractTextPlugin) => {
    const factory = factoryRules(regExp, { exclude });
    let use = concatUse(loader || [], mergeOption);
    if (isExtract) {
      use.unshift(styleUse);
    } else {
      use = (extractTextPlugin || ExtractTextPlugin).extract({ fallback: 'style-loader', use });
    }
    return factory(use);
  }

  return {
    css: factory(/\.(css)/),
    less: factory(/\.(less)/, ['less-loader']),
    sass: factory(/\.(sass|scss)/, ['sass-loader'])
  }
}
