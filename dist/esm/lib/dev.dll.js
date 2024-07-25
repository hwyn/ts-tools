import { __awaiter } from "tslib";
import { existenceDll } from '../config';
import { webpackRunDll } from '../util/bundle';
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return !existenceDll ? Promise.resolve() : webpackRunDll();
});
