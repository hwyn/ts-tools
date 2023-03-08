"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyPlugin = exports.filterAttr = exports.getMergeConfig = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const copy_webpack_plugin_1 = tslib_1.__importDefault(require("copy-webpack-plugin"));
const config_1 = require("../config");
const fs_2 = require("../../core/fs");
const lodash_1 = require("lodash");
const path_1 = tslib_1.__importDefault(require("path"));
const { isDevelopment, sourceRoot } = (0, config_1.platformConfig)();
const getMergeConfig = (filePath, jsRules, cssRules, config) => {
    const mergeClientConfig = (0, fs_2.requireSync)(filePath);
    return (typeof mergeClientConfig === 'function' ? mergeClientConfig : () => mergeClientConfig || {})(jsRules, cssRules, isDevelopment, config);
};
exports.getMergeConfig = getMergeConfig;
const filterAttr = (mergeConfig, filter) => {
    const config = {};
    Object.keys(mergeConfig || {}).filter((key) => !filter.includes(key)).forEach((key) => config[key] = mergeConfig[key]);
    return config;
};
exports.filterAttr = filterAttr;
const copyPlugin = (formFile = [], toFile, sourcePath = sourceRoot) => {
    const files = formFile.reduce((copyArr, filePaths) => {
        const [filePath, _filePath] = filePaths;
        if ((0, fs_1.existsSync)(filePath)) {
            const toFilePath = (_filePath || filePath).replace(sourcePath, toFile);
            const toFileInfo = path_1.default.parse(toFilePath);
            copyArr.push({
                from: filePath,
                to: toFileInfo.ext === '' && toFileInfo.name === '.env' ? toFileInfo.dir : toFilePath,
                noErrorOnMissing: false,
                globOptions: { ignore: ['.*'] }
            });
        }
        return copyArr;
    }, []);
    return !(0, lodash_1.isEmpty)(files) && [new copy_webpack_plugin_1.default({ patterns: files })] || [];
};
exports.copyPlugin = copyPlugin;
exports.default = {
    mode: 'production',
    context: config_1.baseDir,
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
