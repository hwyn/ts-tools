"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var config_1 = require("../config");
var hot_server_1 = require("./hot.server");
// import nodemon from './nodemon.server';
var _a = config_1.project.architect.build, _b = _a === void 0 ? {} : _a, platform = _b.platform;
var _c = (platform === null || platform === void 0 ? void 0 : platform.server) || {}, outputPath = _c.outputPath, configurations = _c.configurations;
exports.default = (function (app) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!config_1.existenceServer) {
                    return [2 /*return*/, Promise.resolve(configurations === null || configurations === void 0 ? void 0 : configurations.proxy)];
                }
                outputPath && app.use(express_1.default.static(outputPath));
                return [4 /*yield*/, (0, hot_server_1.hotServer)()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
