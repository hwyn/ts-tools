"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = require("../core/fs");
var config_1 = require("../config");
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fs_1.cleanDir)(config_1.project.outputRoot)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
