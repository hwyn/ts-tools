import { __awaiter, __generator } from "tslib";
import { existenceDll } from '../config';
import { webpackRunDll } from '../util/bundle';
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, !existenceDll ? Promise.resolve() : webpackRunDll()];
    });
}); });
