import { Configuration } from 'webpack';

import config from '../config';
import { requireSync } from '../../core/fs';

const { baseDir, isDebug, webpackDir } = config;
const webpackDirConfig = webpackDir || 'webpack';

export const getMergeConfig = (fileName: string, jsRules: any, cssRules: any): Configuration => {
  const mergeClientConfig = requireSync(`${baseDir}/${webpackDirConfig}/${fileName}`);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig)(jsRules, cssRules, isDebug);
};

export const filterAttr = (mergeConfig: any, filter: string[]) => {
  const config = {};
  Object.keys(mergeConfig || {}).filter((key: string) => !filter.includes(key)).forEach((key: string) => config[key] = filter[key]);
  return config;
};

export default {
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
};
