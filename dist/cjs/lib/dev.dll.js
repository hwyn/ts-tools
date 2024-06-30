"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var bundle_1 = require("../util/bundle");
var config_1 = require("../config");
exports.default = (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, !config_1.existenceDll ? Promise.resolve() : (0, bundle_1.webpackRunDll)()];
    });
}); });
