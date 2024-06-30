"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
exports.default = (function (entryKey) { return (0, webpack_merge_1.default)((0, webpack_base_config_1.default)(entryKey), {
    mode: 'production',
}); });
