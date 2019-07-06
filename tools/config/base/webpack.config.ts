import { Configuration } from 'webpack';

import config from '../config';
import { requireSync } from '../../core/fs';

const { baseDir, isDebug } = config;
const webpackDir = 'webpack';

export const getMergeConfig = (fileName: string, jsRules: any, cssRules: any): Configuration => {
  const mergeClientConfig = requireSync(`${baseDir}/${webpackDir}/${fileName}`);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig)(jsRules, cssRules, isDebug);
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
