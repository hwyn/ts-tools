import { __awaiter, __generator } from "tslib";
import path from 'path';
import { resolveProject } from '../config/resolve.project';
var argv = process.argv;
function run(fn, options) {
    var task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
export function init() {
    return __awaiter(this, void 0, void 0, function () {
        var exports_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveProject.loadProjectConfig()];
                case 1:
                    _a.sent();
                    if (!(argv.length > 2)) return [3 /*break*/, 3];
                    exports_1 = require("".concat(path.join(__dirname, argv.slice(2)[0]))).default;
                    return [4 /*yield*/, run(exports_1)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
export default run;
