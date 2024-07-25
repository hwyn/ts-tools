"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
var webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
exports.default = (function (entryKey) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = webpack_merge_1.default;
                return [4 /*yield*/, (0, webpack_base_config_1.default)(entryKey)];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), {
                        mode: 'production',
                    }])];
        }
    });
}); });
