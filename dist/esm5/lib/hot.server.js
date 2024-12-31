import { __assign, __awaiter, __generator } from "tslib";
import { isFunction, merge } from 'lodash';
import path from 'path';
import vm from 'vm';
import webpack from 'webpack';
import { platformConfig, webpackDevServer } from '../config';
import { requireSync } from '../core/fs';
import { createCompilationPromise } from './compilation';
var serverPlatform = platformConfig('server');
var _a = serverPlatform.hotContext, hotContext = _a === void 0 ? '' : _a, outputPath = serverPlatform.outputPath;
export var hotServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var vmContext, hotObject, contextSync, hotVmContext, serverConfig, multiCompiler, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, requireSync(hotContext)];
            case 1:
                contextSync = _a.sent();
                hotVmContext = isFunction(contextSync) ? contextSync(serverPlatform) : contextSync || {};
                return [4 /*yield*/, webpackDevServer()];
            case 2:
                serverConfig = _a.sent();
                multiCompiler = webpack(serverConfig);
                promise = new Promise(function (resolve, reject) {
                    var interval = setInterval(function () {
                        if (hotObject) {
                            resolve(hotObject.hotHost);
                            clearInterval(interval);
                        }
                    }, 500);
                    process.on('unhandledRejection', function (reason) { return console.log(reason); });
                    multiCompiler.hooks.done.tap('hot-server', function (stats) {
                        if (hotObject)
                            hotObject === null || hotObject === void 0 ? void 0 : hotObject.hotReload();
                        try {
                            if (!stats.hasErrors()) {
                                multiCompiler.outputFileSystem.readFile(path.join(outputPath, 'server.js'), function (error, code) {
                                    var context = merge(hotVmContext, __assign(__assign({}, global), { require: require, process: process, console: console, global: global, Buffer: Buffer, hotReload: function (reload) { return hotObject = reload; } }));
                                    process.env.NODE_ENV = 'development';
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
                        }
                    });
                });
                multiCompiler.watch({ aggregateTimeout: 300 }, function () { });
                return [4 /*yield*/, createCompilationPromise('server', multiCompiler, serverConfig)];
            case 3:
                _a.sent();
                return [2 /*return*/, promise];
        }
    });
}); };
