"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../core/fs");
const config_1 = require("../config");
exports.default = async () => {
    await (0, fs_1.cleanDir)(config_1.project.outputRoot);
};
