"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const config_1 = require("../config");
const webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
const { tsConfig } = config_1.platformConfig(config_1.PlatformEnum.server);
exports.default = () => {
    process.env.TS_NODE_PROJECT = tsConfig;
    return webpack_merge_1.default(webpack_base_config_1.default(), {});
};
