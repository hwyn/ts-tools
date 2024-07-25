import { __awaiter, __generator } from "tslib";
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = merge;
                return [4 /*yield*/, baseConfig()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), {
                        mode: 'development'
                    }])];
        }
    });
}); });
