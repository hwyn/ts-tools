"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var terser_webpack_plugin_1 = tslib_1.__importDefault(require("terser-webpack-plugin"));
var mini_css_extract_plugin_1 = tslib_1.__importDefault(require("mini-css-extract-plugin"));
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
var config_1 = require("../config");
var _a = (0, config_1.platformConfig)(config_1.PlatformEnum.client), tsConfig = _a.tsConfig, analyzerStatus = _a.analyzerStatus;
exports.default = (function () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), {
        optimization: tslib_1.__assign(tslib_1.__assign({ emitOnErrors: true, runtimeChunk: false, mergeDuplicateChunks: true, splitChunks: {} }, analyzerStatus ? { concatenateModules: false } : {}), { minimize: true, minimizer: [
                new terser_webpack_plugin_1.default({
                    minify: terser_webpack_plugin_1.default.uglifyJsMinify,
                    terserOptions: {},
                    extractComments: false,
                })
            ] }),
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: 'styleSheet/[name].[contenthash:4].css',
                chunkFilename: 'styleSheet/[name].[chunkhash:4].css',
            }),
        ]
    });
});
