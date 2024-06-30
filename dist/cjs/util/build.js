"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var config_1 = require("../config");
var fs_1 = require("../core/fs");
var clean_1 = tslib_1.__importDefault(require("./clean"));
var bundle_1 = tslib_1.__importDefault(require("./bundle"));
var run_1 = tslib_1.__importDefault(require("./run"));
var fs_2 = tslib_1.__importDefault(require("fs"));
var defaultPath = "".concat(config_1.project.packagePath, "/package.json");
var pkg = (0, fs_1.requireSync)(fs_2.default.existsSync(defaultPath) ? defaultPath : config_1.project.packagePath);
exports.default = (function (pkg, buildDir) { return function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, run_1.default)(clean_1.default)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, run_1.default)(bundle_1.default)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, fs_1.writeFile)("".concat(buildDir, "/package.json"), JSON.stringify({
                        private: true,
                        scripts: {
                            "start": "node server.js",
                        },
                        dependencies: pkg.dependencies,
                    }))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); }; })(pkg || {}, config_1.project.outputRoot);
