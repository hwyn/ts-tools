"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var config_1 = require("../config");
var fs_2 = require("../core/fs");
var bundle_1 = tslib_1.__importDefault(require("./bundle"));
var clean_1 = tslib_1.__importDefault(require("./clean"));
var run_1 = tslib_1.__importDefault(require("./run"));
var defaultPath = "".concat(config_1.project.packagePath, "/package.json");
exports.default = (function (buildDir) { return function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var pkg;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, fs_2.requireSync)(fs_1.default.existsSync(defaultPath) ? defaultPath : config_1.project.packagePath)];
            case 1:
                pkg = (_a.sent()) || {};
                return [4 /*yield*/, (0, run_1.default)(clean_1.default)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, run_1.default)(bundle_1.default)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, fs_2.writeFile)("".concat(buildDir, "/package.json"), JSON.stringify({
                        private: true,
                        scripts: {
                            "start": "node server.js",
                        },
                        dependencies: pkg.dependencies,
                    }))];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }; })(config_1.project.outputRoot);
