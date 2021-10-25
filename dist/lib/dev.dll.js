"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bundle_1 = require("../util/bundle");
const config_1 = require("../config");
exports.default = async () => {
    const dll = config_1.webpackDevDll();
    return bundle_1.webpackRun(dll, dll.stats);
};
