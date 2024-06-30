"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var terser_webpack_plugin_1 = tslib_1.__importDefault(require("terser-webpack-plugin"));
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
var config_1 = require("../config");
var analyzerStatus = (0, config_1.platformConfig)(config_1.PlatformEnum.dll).analyzerStatus;
exports.default = (function (entryKey) { return (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(entryKey), {
    optimization: tslib_1.__assign(tslib_1.__assign({ splitChunks: {}, mergeDuplicateChunks: true, minimize: true }, analyzerStatus ? { concatenateModules: false } : {}), { minimizer: [
            new terser_webpack_plugin_1.default({
                minify: terser_webpack_plugin_1.default.uglifyJsMinify,
                terserOptions: {},
                extractComments: false,
            })
        ] }),
}); });
