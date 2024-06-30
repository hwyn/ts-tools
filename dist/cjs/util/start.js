"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var browser_sync_1 = tslib_1.__importDefault(require("browser-sync"));
var config_1 = require("../config");
var clean_1 = tslib_1.__importDefault(require("./clean"));
var dev_server_1 = tslib_1.__importDefault(require("../lib/dev.server"));
var dev_client_1 = tslib_1.__importDefault(require("../lib/dev.client"));
var dev_server_entry_1 = tslib_1.__importDefault(require("../lib/dev.server.entry"));
var dev_dll_1 = tslib_1.__importDefault(require("../lib/dev.dll"));
var app = (0, express_1.default)();
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var host;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, clean_1.default)()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, dev_dll_1.default)()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, dev_client_1.default)(app)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, dev_server_entry_1.default)()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, dev_server_1.default)(app)];
            case 5:
                host = _a.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        config_1.existenceClient ? browser_sync_1.default.create().init(tslib_1.__assign({ ui: false, middleware: app }, host ? { proxy: { target: host } } : { server: true }), function (error, bs) { return error ? reject(error) : resolve(bs); }) : Promise.resolve();
                    })];
        }
    });
}); });
