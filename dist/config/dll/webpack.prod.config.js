"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = require("webpack");
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const uglifyjs_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("uglifyjs-webpack-plugin"));
const webpack_base_config_1 = (0, tslib_1.__importDefault)(require("./webpack.base.config"));
const config_1 = require("../config");
const { isDevelopment } = (0, config_1.platformConfig)();
exports.default = () => (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), {
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new webpack_1.HashedModuleIdsPlugin(),
            new uglifyjs_webpack_plugin_1.default({
                sourceMap: isDevelopment,
                cache: true,
                parallel: true,
                uglifyOptions: {
                    safari10: true,
                    output: {
                        ascii_only: true,
                        comments: false,
                        webkit: true,
                    },
                    compress: {
                        pure_getters: true,
                        passes: 3,
                        inline: 3,
                    }
                }
            }),
        ]
    },
});
