"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const happypack_1 = require("../../core/happypack");
const webpack_base_config_1 = (0, tslib_1.__importDefault)(require("./webpack.base.config"));
exports.default = () => {
    const config = (0, webpack_base_config_1.default)();
    return (0, happypack_1.happypackMerge)((0, webpack_merge_1.default)(config, {
        mode: 'development',
        watch: true,
        devtool: false,
    }));
};
