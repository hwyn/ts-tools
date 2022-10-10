"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const terser_webpack_plugin_1 = tslib_1.__importDefault(require("terser-webpack-plugin"));
const webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
const config_1 = require("../config");
const { analyzerStatus } = (0, config_1.platformConfig)(config_1.PlatformEnum.dll);
exports.default = (entryKey) => (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(entryKey), {
    optimization: {
        splitChunks: {},
        mergeDuplicateChunks: true,
        minimize: true,
        ...analyzerStatus ? { concatenateModules: false } : {},
        minimizer: [
            new terser_webpack_plugin_1.default({
                minify: terser_webpack_plugin_1.default.uglifyJsMinify,
                terserOptions: {},
                extractComments: false,
            })
        ]
    },
});
