"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotServer = void 0;
const tslib_1 = require("tslib");
const vm_1 = tslib_1.__importDefault(require("vm"));
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const webpack_dev_middleware_1 = tslib_1.__importDefault(require("webpack-dev-middleware"));
const compilation_1 = require("./compilation");
const path_1 = tslib_1.__importDefault(require("path"));
const config_1 = require("../config");
const fs_1 = require("../core/fs");
const lodash_1 = require("lodash");
const serverPlatform = config_1.platformConfig('server');
const { hotContext, outputPath } = serverPlatform;
exports.hotServer = async () => {
    let vmContext;
    const contextSync = fs_1.requireSync(hotContext);
    const hotVmContext = lodash_1.isFunction(contextSync) ? contextSync(serverPlatform) : contextSync;
    const serverConfig = config_1.webpackDevServer();
    const multiCompiler = webpack_1.default(serverConfig);
    webpack_dev_middleware_1.default(multiCompiler, {});
    const promise = new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (vmContext && vmContext.global.hotHttpHost) {
                resolve(vmContext.global.hotHttpHost);
                clearInterval(interval);
            }
        }, 500);
        multiCompiler.hooks.done.tap('hot-server', (stats) => {
            if (vmContext && vmContext.global.hotHttpServer) {
                vmContext.global.hotHttpServer.close();
            }
            try {
                if (!stats.hasErrors()) {
                    multiCompiler.outputFileSystem.readFile(path_1.default.join(outputPath, 'server.js'), (error, code) => {
                        const context = lodash_1.merge({ ...global, require, process, console, global, Buffer }, hotVmContext);
                        vmContext = vm_1.default.createContext(context);
                        console.log(code);
                        vm_1.default.runInContext(code.toString('utf-8'), vmContext);
                    });
                }
            }
            catch (e) {
                console.log(e);
                clearInterval(interval);
                reject(null);
            }
        });
    });
    await compilation_1.createCompilationPromise('server', multiCompiler, serverConfig);
    return promise;
};
