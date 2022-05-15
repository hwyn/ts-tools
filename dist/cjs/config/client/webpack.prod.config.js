"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const terser_webpack_plugin_1 = tslib_1.__importDefault(require("terser-webpack-plugin"));
const mini_css_extract_plugin_1 = tslib_1.__importDefault(require("mini-css-extract-plugin"));
const webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
const config_1 = require("../config");
const { tsConfig, analyzerStatus } = (0, config_1.platformConfig)(config_1.PlatformEnum.client);
exports.default = () => {
    process.env.TS_NODE_PROJECT = tsConfig;
    return (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), {
        optimization: {
            emitOnErrors: true,
            runtimeChunk: false,
            mergeDuplicateChunks: true,
            splitChunks: {},
            ...analyzerStatus ? { concatenateModules: false } : {},
            minimize: true,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    minify: terser_webpack_plugin_1.default.uglifyJsMinify,
                    terserOptions: {},
                    extractComments: false,
                })
            ]
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: 'styleSheet/[name].[contenthash:4].css',
                chunkFilename: 'styleSheet/[name].[chunkhash:4].css',
            }),
        ]
    });
};
