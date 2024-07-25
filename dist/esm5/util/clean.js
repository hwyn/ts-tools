import { __awaiter, __generator } from "tslib";
import { project } from '../config';
import { cleanDir } from '../core/fs';
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cleanDir(project.outputRoot)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
