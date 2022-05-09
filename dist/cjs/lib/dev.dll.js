"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bundle_1 = require("../util/bundle");
const config_1 = require("../config");
exports.default = async () => {
    return !config_1.existenceDll ? Promise.resolve() : (0, bundle_1.webpackRunDll)();
};
