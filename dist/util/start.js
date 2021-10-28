"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const browser_sync_1 = (0, tslib_1.__importDefault)(require("browser-sync"));
const config_1 = require("../config");
const clean_1 = (0, tslib_1.__importDefault)(require("./clean"));
const dev_server_1 = (0, tslib_1.__importDefault)(require("../lib/dev.server"));
const dev_client_1 = (0, tslib_1.__importDefault)(require("../lib/dev.client"));
const dev_server_entry_1 = (0, tslib_1.__importDefault)(require("../lib/dev.server.entry"));
const dev_dll_1 = (0, tslib_1.__importDefault)(require("../lib/dev.dll"));
const app = (0, express_1.default)();
exports.default = async () => {
    await (0, clean_1.default)();
    await (0, dev_dll_1.default)();
    await (0, dev_client_1.default)(app);
    await (0, dev_server_entry_1.default)();
    const host = await (0, dev_server_1.default)(app);
    return new Promise((resolve, reject) => {
        config_1.existenceClient ? browser_sync_1.default.create().init({
            ui: false,
            proxy: {
                target: host,
                middleware: app,
            },
        }, (error, bs) => error ? reject(error) : resolve(bs)) : Promise.resolve();
    });
};
