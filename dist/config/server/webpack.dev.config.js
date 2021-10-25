"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
exports.default = () => webpack_merge_1.default(webpack_base_config_1.default(), {
    mode: 'development',
});
