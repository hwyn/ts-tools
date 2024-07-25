import { __awaiter } from "tslib";
import CopyPlugin from 'copy-webpack-plugin';
import { existsSync } from 'fs';
import { isEmpty } from 'lodash';
import path from 'path';
import { requireSync } from '../../core/fs';
import { baseDir, platformConfig } from '../config';
const { isDevelopment, sourceRoot } = platformConfig();
export const getMergeConfig = (filePath, jsRules, cssRules, config) => __awaiter(void 0, void 0, void 0, function* () {
    const mergeClientConfig = yield requireSync(filePath);
    const args = [jsRules, cssRules, isDevelopment, config];
    return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig || {})(...args);
});
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
        cachedAssets: false,
        moduleTrace: false
    },
};
