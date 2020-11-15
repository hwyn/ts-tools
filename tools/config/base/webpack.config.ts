import { existsSync, mkdirSync } from 'fs';
import { Configuration, Plugin } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

import { baseDir, platformConfig }  from '../config';
import { requireSync } from '../../core/fs';
import { isEmpty } from 'lodash';

const { isDevelopment } = platformConfig();

export const getMergeConfig = (filePath: string, jsRules?: any, cssRules?: any): Configuration => {
  const mergeClientConfig = requireSync(filePath);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig || {})(jsRules, cssRules, isDevelopment);
};

export const filterAttr = (mergeConfig: any, filter: string[]) => {
  const config = {};
  Object.keys(mergeConfig || {}).filter((key: string) => !filter.includes(key)).forEach((key: string) => config[key] = mergeConfig[key]);
  return config;
};

export const copyPlugin = (formFile: string | string[], toFile: string): Plugin[] => {
  const files = (Array.isArray(formFile) ? formFile : [formFile]).reduce((copyArr, filePath: string) => {
    if (existsSync(filePath)) {
      copyArr.push({ from: filePath, to: toFile , noErrorOnMissing: false,  globOptions: { ignore: ['.*'] }});
    }
    return copyArr;
  }, []);
  return !isEmpty(files) && [new CopyPlugin({ patterns: files })] || [];
};

export default {
  mode: 'production',
  context: baseDir,
  stats: {
    colors: true,
    hash: true, // required by custom stat output
    timings: true, // required by custom stat output
    chunks: true, // required by custom stat output
    chunkModules: false,
    modules: false,
    reasons: false,
    warnings: true,
    errors: true,
    assets: true, // required by custom stat output
    version: false,
    errorDetails: false,
    moduleTrace: false,
  },
} as Configuration;
