import { __awaiter } from "tslib";
import { webpackRunDll } from '../util/bundle';
import { existenceDll } from '../config';
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return !existenceDll ? Promise.resolve() : webpackRunDll();
});
