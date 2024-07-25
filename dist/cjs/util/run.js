"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var resolve_project_1 = require("../config/resolve.project");
var argv = process.argv;
function run(fn, options) {
    var task = typeof fn.default === 'undefined' ? fn : fn.default;
    return task(options);
}
function init() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var exports_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolve_project_1.resolveProject.loadProjectConfig()];
                case 1:
                    _a.sent();
                    if (!(argv.length > 2)) return [3 /*break*/, 3];
                    exports_1 = require("".concat(path_1.default.join(__dirname, argv.slice(2)[0]))).default;
                    return [4 /*yield*/, run(exports_1)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = run;
