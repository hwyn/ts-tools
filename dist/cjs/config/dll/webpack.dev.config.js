"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const webpack_base_config_1 = (0, tslib_1.__importDefault)(require("./webpack.base.config"));
exports.default = (entryKey) => (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(entryKey), {
    mode: 'production',
});
