import { existsSync } from 'fs';
import CopyPlugin from 'copy-webpack-plugin';
import { baseDir, platformConfig } from '../config';
import { requireSync } from '../../core/fs';
import { isEmpty } from 'lodash';
import path from 'path';
var _a = platformConfig(), isDevelopment = _a.isDevelopment, sourceRoot = _a.sourceRoot;
export var getMergeConfig = function (filePath, jsRules, cssRules, config) {
    var mergeClientConfig = requireSync(filePath);
    return (typeof mergeClientConfig === 'function' ? mergeClientConfig : function () { return mergeClientConfig || {}; })(jsRules, cssRules, isDevelopment, config);
};
export var filterAttr = function (mergeConfig, filter) {
    var config = {};
    Object.keys(mergeConfig || {}).filter(function (key) { return !filter.includes(key); }).forEach(function (key) { return config[key] = mergeConfig[key]; });
    return config;
};
export var copyPlugin = function (formFile, toFile, sourcePath) {
    if (formFile === void 0) { formFile = []; }
    if (sourcePath === void 0) { sourcePath = sourceRoot; }
    var files = formFile.reduce(function (copyArr, filePaths) {
        var filePath = filePaths[0], _filePath = filePaths[1];
        if (existsSync(filePath)) {
            var toFilePath = (_filePath || filePath).replace(sourcePath, toFile);
            var toFileInfo = path.parse(toFilePath);
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
