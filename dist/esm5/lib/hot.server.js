import { __assign, __awaiter, __generator } from "tslib";
import vm from 'vm';
import webpack from 'webpack';
import { createCompilationPromise } from './compilation';
import path from 'path';
import { platformConfig, webpackDevServer } from '../config';
import { requireSync } from '../core/fs';
import { isFunction, merge } from 'lodash';
var serverPlatform = platformConfig('server');
var _a = serverPlatform.hotContext, hotContext = _a === void 0 ? '' : _a, outputPath = serverPlatform.outputPath;
export var hotServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var vmContext, contextSync, hotVmContext, serverConfig, multiCompiler, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contextSync = requireSync(hotContext);
                hotVmContext = isFunction(contextSync) ? contextSync(serverPlatform) : contextSync || {};
                serverConfig = webpackDevServer();
                multiCompiler = webpack(serverConfig);
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
                                multiCompiler.outputFileSystem.readFile(path.join(outputPath, 'server.js'), function (error, code) {
                                    process.env.NODE_ENV = 'development';
                                    var context = merge(hotVmContext, __assign(__assign({}, global), { require: require, process: process, console: console, global: global, Buffer: Buffer }));
                                    vmContext = vm.createContext(context);
                                    vm.runInNewContext(code.toString('utf-8'), vmContext);
                                });
                            }
                            else {
                                stats.toJson().errors.forEach(function (error) { return console.error(error.stack); });
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
                return [4 /*yield*/, createCompilationPromise('server', multiCompiler, serverConfig)];
            case 1:
                _a.sent();
                return [2 /*return*/, promise];
        }
    });
}); };
