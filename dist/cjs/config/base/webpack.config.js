"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyPlugin = exports.filterAttr = exports.getMergeConfig = void 0;
var tslib_1 = require("tslib");
var copy_webpack_plugin_1 = tslib_1.__importDefault(require("copy-webpack-plugin"));
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var path_1 = tslib_1.__importDefault(require("path"));
var fs_2 = require("../../core/fs");
var config_1 = require("../config");
var _a = (0, config_1.platformConfig)(), isDevelopment = _a.isDevelopment, sourceRoot = _a.sourceRoot;
var getMergeConfig = function (filePath, jsRules, cssRules, config) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var mergeClientConfig, args;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fs_2.requireSync)(filePath)];
            case 1:
                mergeClientConfig = _a.sent();
                args = [jsRules, cssRules, isDevelopment, config];
                return [2 /*return*/, (typeof mergeClientConfig === 'function' ? mergeClientConfig : function () { return mergeClientConfig || {}; }).apply(void 0, args)];
        }
    });
}); };
exports.getMergeConfig = getMergeConfig;
var filterAttr = function (mergeConfig, filter) {
    var config = {};
    Object.keys(mergeConfig || {}).filter(function (key) { return !filter.includes(key); }).forEach(function (key) { return config[key] = mergeConfig[key]; });
    return config;
};
exports.filterAttr = filterAttr;
var copyPlugin = function (formFile, toFile, sourcePath) {
    if (formFile === void 0) { formFile = []; }
    if (sourcePath === void 0) { sourcePath = sourceRoot; }
    var files = formFile.reduce(function (copyArr, filePaths) {
        var filePath = filePaths[0], _filePath = filePaths[1];
        if ((0, fs_1.existsSync)(filePath)) {
            var toFilePath = (_filePath || filePath).replace(sourcePath, toFile);
            var toFileInfo = path_1.default.parse(toFilePath);
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
