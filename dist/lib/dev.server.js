"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const config_1 = require("../config");
const hot_server_1 = require("./hot.server");
const { architect: { build: { platform } } } = config_1.project;
const { outputPath } = platform.server || {};
exports.default = async (app) => {
    app.use(express_1.default.static(outputPath));
    return await hot_server_1.hotServer(); // await nodemon();
};
