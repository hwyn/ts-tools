"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = (0, tslib_1.__importStar)(require("webpack"));
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const uglifyjs_webpack_plugin_1 = (0, tslib_1.__importDefault)(require("uglifyjs-webpack-plugin"));
const webpack_base_config_1 = (0, tslib_1.__importDefault)(require("./webpack.base.config"));
exports.default = () => (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), {
    optimization: {
        noEmitOnErrors: true,
        minimizer: [
            new webpack_1.HashedModuleIdsPlugin(),
            new uglifyjs_webpack_plugin_1.default({
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
    ]
});
