import { __awaiter, __generator } from "tslib";
import express from 'express';
import { existenceServer, project } from '../config';
import { hotServer } from './hot.server';
// import nodemon from './nodemon.server';
var _a = project.architect.build, _b = _a === void 0 ? {} : _a, platform = _b.platform;
var _c = (platform === null || platform === void 0 ? void 0 : platform.server) || {}, outputPath = _c.outputPath, configurations = _c.configurations;
export default (function (app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!existenceServer) {
                    return [2 /*return*/, Promise.resolve(configurations === null || configurations === void 0 ? void 0 : configurations.proxy)];
                }
                outputPath && app.use(express.static(outputPath));
                return [4 /*yield*/, hotServer()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
