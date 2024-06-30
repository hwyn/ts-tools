import { __awaiter, __generator } from "tslib";
import { webpackRunDll } from '../util/bundle';
import { existenceDll } from '../config';
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, !existenceDll ? Promise.resolve() : webpackRunDll()];
    });
}); });
