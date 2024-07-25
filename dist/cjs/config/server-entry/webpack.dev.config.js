"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var happypack_1 = require("../../core/happypack");
var config_1 = require("../config");
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
var _a = (0, config_1.platformConfig)(config_1.PlatformEnum.serverEntry), sourceMap = _a.sourceMap, hasSourceMap = _a.hasSourceMap;
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = happypack_1.happypackMerge;
                _b = webpack_merge_1.default;
                return [4 /*yield*/, (0, webpack_base_config_1.default)()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.apply(void 0, [_c.sent(), tslib_1.__assign({ mode: 'development', watch: true, devtool: false }, hasSourceMap ? { devtool: sourceMap } : {})]), { excludeLoader: ['css-loader'] }])];
        }
    });
}); });
