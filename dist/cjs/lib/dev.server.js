"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const config_1 = require("../config");
const hot_server_1 = require("./hot.server");
const nodemon_server_1 = tslib_1.__importDefault(require("./nodemon.server"));
const { architect: { build: { platform } = {} } } = config_1.project;
const { outputPath, configurations } = platform?.server || {};
exports.default = async (app) => {
    if (!config_1.existenceServer) {
        return Promise.resolve('');
    }
    outputPath && app.use(express_1.default.static(outputPath));
    return configurations?.isNodemon ? await (0, nodemon_server_1.default)() : await (0, hot_server_1.hotServer)();
};
