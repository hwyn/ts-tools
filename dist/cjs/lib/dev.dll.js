"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bundle_1 = require("../util/bundle");
const config_1 = require("../config");
exports.default = async () => {
    if (!config_1.existenceDll) {
        return Promise.resolve();
    }
    const dll = (0, config_1.webpackDevDll)();
    return (0, bundle_1.webpackRun)(dll, dll.stats);
};
