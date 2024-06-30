"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotServer = void 0;
var tslib_1 = require("tslib");
var vm_1 = tslib_1.__importDefault(require("vm"));
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var compilation_1 = require("./compilation");
var path_1 = tslib_1.__importDefault(require("path"));
var config_1 = require("../config");
var fs_1 = require("../core/fs");
var lodash_1 = require("lodash");
var serverPlatform = (0, config_1.platformConfig)('server');
var _a = serverPlatform.hotContext, hotContext = _a === void 0 ? '' : _a, outputPath = serverPlatform.outputPath;
var hotServer = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var vmContext, contextSync, hotVmContext, serverConfig, multiCompiler, promise;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contextSync = (0, fs_1.requireSync)(hotContext);
                hotVmContext = (0, lodash_1.isFunction)(contextSync) ? contextSync(serverPlatform) : contextSync || {};
                serverConfig = (0, config_1.webpackDevServer)();
                multiCompiler = (0, webpack_1.default)(serverConfig);
                promise = new Promise(function (resolve, reject) {
                    var interval = setInterval(function () {
                        if (vmContext && vmContext.global.hotHttpHost) {
                            resolve(vmContext.global.hotHttpHost);
                            clearInterval(interval);
                        }
                    }, 500);
                    process.on('unhandledRejection', function (reason) { return console.log(reason); });
                    multiCompiler.hooks.done.tap('hot-server', function (stats) {
                        if (vmContext && vmContext.global.hotHttpServer) {
                            vmContext.global.hotHttpServer.close();
                        }
                        try {
                            if (!stats.hasErrors()) {
                                multiCompiler.outputFileSystem.readFile(path_1.default.join(outputPath, 'server.js'), function (error, code) {
                                    process.env.NODE_ENV = 'development';
                                    var context = (0, lodash_1.merge)(hotVmContext, tslib_1.__assign(tslib_1.__assign({}, global), { require: require, process: process, console: console, global: global, Buffer: Buffer }));
                                    vmContext = vm_1.default.createContext(context);
                                    vm_1.default.runInNewContext(code.toString('utf-8'), vmContext);
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
                multiCompiler.watch({ aggregateTimeout: 300 }, function () { });
                return [4 /*yield*/, (0, compilation_1.createCompilationPromise)('server', multiCompiler, serverConfig)];
            case 1:
                _a.sent();
                return [2 /*return*/, promise];
        }
    });
}); };
exports.hotServer = hotServer;
