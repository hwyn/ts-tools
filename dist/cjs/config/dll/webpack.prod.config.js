"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var terser_webpack_plugin_1 = tslib_1.__importDefault(require("terser-webpack-plugin"));
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var config_1 = require("../config");
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
var analyzerStatus = (0, config_1.platformConfig)(config_1.PlatformEnum.dll).analyzerStatus;
exports.default = (function (entryKey) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = webpack_merge_1.default;
                return [4 /*yield*/, (0, webpack_base_config_1.default)(entryKey)];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), {
                        optimization: tslib_1.__assign(tslib_1.__assign({ mergeDuplicateChunks: true }, analyzerStatus ? { mergeDuplicateChunks: false, concatenateModules: false } : {}), { minimize: true, minimizer: [
                                new terser_webpack_plugin_1.default({
                                    terserOptions: {
                                        format: { comments: false }
                                    },
                                    extractComments: false,
                                })
                            ] }),
                    }])];
        }
    });
}); });
