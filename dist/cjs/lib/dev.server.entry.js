"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var config_1 = require("../config");
var compilation_1 = require("./compilation");
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var config, multiCompiler, promise;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!config_1.existenceServerEntry) {
                    return [2 /*return*/, Promise.resolve()];
                }
                return [4 /*yield*/, (0, config_1.webpackDevServerEntry)()];
            case 1:
                config = _a.sent();
                multiCompiler = (0, webpack_1.default)(config, function (error, stats) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log(stats.toString(config.stats));
                });
                promise = (0, compilation_1.createCompilationPromise)('server-entry', multiCompiler, config);
                multiCompiler.watch({ aggregateTimeout: 300 }, function () { });
                return [2 /*return*/, promise];
        }
    });
}); });
