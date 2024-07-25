import { __awaiter, __generator } from "tslib";
import CopyPlugin from 'copy-webpack-plugin';
import { existsSync } from 'fs';
import { isEmpty } from 'lodash';
import path from 'path';
import { requireSync } from '../../core/fs';
import { baseDir, platformConfig } from '../config';
var _a = platformConfig(), isDevelopment = _a.isDevelopment, sourceRoot = _a.sourceRoot;
export var getMergeConfig = function (filePath, jsRules, cssRules, config) { return __awaiter(void 0, void 0, void 0, function () {
    var mergeClientConfig, args;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, requireSync(filePath)];
            case 1:
                mergeClientConfig = _a.sent();
                args = [jsRules, cssRules, isDevelopment, config];
                return [2 /*return*/, (typeof mergeClientConfig === 'function' ? mergeClientConfig : function () { return mergeClientConfig || {}; }).apply(void 0, args)];
        }
    });
}); };
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
