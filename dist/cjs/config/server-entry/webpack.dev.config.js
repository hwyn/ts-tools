"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = (0, tslib_1.__importDefault)(require("webpack"));
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const happypack_1 = require("../../core/happypack");
const webpack_base_config_1 = (0, tslib_1.__importDefault)(require("./webpack.base.config"));
exports.default = () => {
    return (0, happypack_1.happypackMerge)((0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), {
        mode: 'development',
        watch: true,
        devtool: false,
        plugins: [
            new webpack_1.default.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("development"),
                }
            }),
        ]
    }), { excludeLoader: ['css-loader'] });
};
