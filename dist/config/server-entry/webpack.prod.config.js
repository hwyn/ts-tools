"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const terser_webpack_plugin_1 = tslib_1.__importDefault(require("terser-webpack-plugin"));
const webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
exports.default = () => webpack_merge_1.default(webpack_base_config_1.default(), {
    optimization: {
        emitOnErrors: true,
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
        new webpack_1.default.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        }),
    ]
});
