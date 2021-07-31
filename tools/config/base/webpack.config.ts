import { existsSync, mkdirSync } from 'fs';
import { Configuration, Plugin } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

import { baseDir, platformConfig } from '../config';
import { requireSync } from '../../core/fs';
import { isEmpty } from 'lodash';
import path from 'path';

const { isDevelopment, sourceRoot } = platformConfig();

export const getMergeConfig = (filePath: string, jsRules?: any, cssRules?: any): Configuration => {
  const mergeClientConfig = requireSync(filePath);
  return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig || {})(jsRules, cssRules, isDevelopment);
};

export const filterAttr = (mergeConfig: any, filter: string[]) => {
  const config = {};
  Object.keys(mergeConfig || {}).filter((key: string) => !filter.includes(key)).forEach((key: string) => config[key] = mergeConfig[key]);
  return config;
};

export const copyPlugin = (formFile: string[][], toFile: string, sourcePath: string = sourceRoot): Plugin[] => {
  const files = formFile.reduce((copyArr: any[], filePaths: string | string[]) => {
    const [ filePath, _filePath ] = filePaths;
    if (existsSync(filePath)) {
      const toFilePath = (_filePath || filePath).replace(sourcePath, toFile);
      const toFileInfo = path.parse(toFilePath);
      copyArr.push({
        from: filePath,
        to: toFileInfo.ext === '' && toFileInfo.name ==='.env' ? toFileInfo.dir :  toFilePath,
        noErrorOnMissing: false,
        globOptions: { ignore: ['.*'] }
      });
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
    assets: false, // required by custom stat output
    version: false,
    errorDetails: false,
    moduleTrace: false,
  },
} as Configuration;
