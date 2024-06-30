import { __awaiter, __generator } from "tslib";
import path from 'path';
var arvg = process.argv;
function run(fn, options) {
    var task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
export function init() {
    return __awaiter(this, void 0, void 0, function () {
        var exports_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(arvg.length > 2)) return [3 /*break*/, 2];
                    exports_1 = require("".concat(path.join(__dirname, arvg.slice(2)[0]))).default;
                    return [4 /*yield*/, run(exports_1)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
export default run;
