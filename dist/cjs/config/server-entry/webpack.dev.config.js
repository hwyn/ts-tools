"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var happypack_1 = require("../../core/happypack");
var config_1 = require("../config");
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
var _a = (0, config_1.platformConfig)(config_1.PlatformEnum.serverEntry), sourceMap = _a.sourceMap, hasSourceMap = _a.hasSourceMap;
exports.default = (function () {
    return (0, happypack_1.happypackMerge)((0, webpack_merge_1.default)((0, webpack_base_config_1.default)(), tslib_1.__assign({ mode: 'development', watch: true, devtool: false }, hasSourceMap ? { devtool: sourceMap } : {})), { excludeLoader: ['css-loader'] });
});
