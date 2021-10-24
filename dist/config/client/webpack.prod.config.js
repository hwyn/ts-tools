"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = (0, tslib_1.__importStar)(require("webpack"));
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const uglifyjs_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("uglifyjs-webpack-plugin"));
const mini_css_extract_plugin_1 = (0, tslib_1.__importDefault)(require("mini-css-extract-plugin"));
const webpack_base_config_1 = (0, tslib_1.__importDefault)(require("./webpack.base.config"));
const config_1 = require("../config");
const { isDevelopment, tsConfig } = (0, config_1.platformConfig)(config_1.PlatformEnum.client);
exports.default = () => {
    process.env.TS_NODE_PROJECT = tsConfig;
    return (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), {
        optimization: {
            noEmitOnErrors: true,
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    default: {
                        chunks: 'async',
                        minChunks: 2,
                        priority: 10
                    },
                    common: {
                        name: 'common',
                        chunks: 'async',
                        minChunks: 2,
                        enforce: true,
                        priority: 5
                    },
                    vendors: false,
                    vendor: false
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
        plugins: [
            new webpack_1.default.DefinePlugin({
                'process.env.NODE_ENV': "'production'"
            }),
            new mini_css_extract_plugin_1.default({
                filename: 'styleSheet/[name].[hash:4].css',
                chunkFilename: 'styleSheet/[name].[chunkhash:4].css',
            }),
        ]
    });
};
