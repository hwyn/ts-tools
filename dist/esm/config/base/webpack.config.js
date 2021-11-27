import { existsSync } from 'fs';
import CopyPlugin from 'copy-webpack-plugin';
import { baseDir, platformConfig } from '../config';
import { requireSync } from '../../core/fs';
import { isEmpty } from 'lodash';
import path from 'path';
const { isDevelopment, sourceRoot } = platformConfig();
export const getMergeConfig = (filePath, jsRules, cssRules) => {
    const mergeClientConfig = requireSync(filePath);
    return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig || {})(jsRules, cssRules, isDevelopment);
};
export const filterAttr = (mergeConfig, filter) => {
    const config = {};
    Object.keys(mergeConfig || {}).filter((key) => !filter.includes(key)).forEach((key) => config[key] = mergeConfig[key]);
    return config;
};
export const copyPlugin = (formFile = [], toFile, sourcePath = sourceRoot) => {
    const files = formFile.reduce((copyArr, filePaths) => {
        const [filePath, _filePath] = filePaths;
        if (existsSync(filePath)) {
            const toFilePath = (_filePath || filePath).replace(sourcePath, toFile);
            const toFileInfo = path.parse(toFilePath);
            copyArr.push({
                from: filePath,
                to: toFileInfo.ext === '' && toFileInfo.name === '.env' ? toFileInfo.dir : toFilePath,
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
        hash: true,
        timings: true,
        chunks: true,
        chunkModules: false,
        modules: false,
        reasons: false,
        warnings: true,
        errors: true,
        assets: false,
        version: false,
        errorDetails: false,
        cachedAssets: false,
        moduleTrace: false
    },
};
