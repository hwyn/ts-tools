import { __awaiter } from "tslib";
import { isFunction, merge } from 'lodash';
import path from 'path';
import vm from 'vm';
import webpack from 'webpack';
import { platformConfig, webpackDevServer } from '../config';
import { requireSync } from '../core/fs';
import { createCompilationPromise } from './compilation';
const serverPlatform = platformConfig('server');
const { hotContext = '', outputPath } = serverPlatform;
export const hotServer = () => __awaiter(void 0, void 0, void 0, function* () {
    let vmContext;
    let hotReload;
    const contextSync = yield requireSync(hotContext);
    const hotVmContext = isFunction(contextSync) ? contextSync(serverPlatform) : contextSync || {};
    const serverConfig = yield webpackDevServer();
    const multiCompiler = webpack(serverConfig);
    const promise = new Promise((resolve, reject) => {
        process.on('unhandledRejection', (reason) => console.log(reason));
        multiCompiler.hooks.done.tap('hot-server', (stats) => {
            if (hotReload)
                hotReload();
            try {
                if (!stats.hasErrors()) {
                    multiCompiler.outputFileSystem.readFile(path.join(outputPath, 'server.js'), (error, code) => {
                        const context = merge(hotVmContext, Object.assign(Object.assign({}, global), { require, process, console, global, Buffer, hotReload: (reload) => hotReload = reload }));
                        process.env.NODE_ENV = 'development';
                        vmContext = vm.createContext(context);
                        vm.runInNewContext(code.toString('utf-8'), vmContext);
                        resolve(null);
                    });
                }
                else {
                    stats.toJson().errors.forEach((error) => console.error(error.stack));
                }
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
        });
    });
    multiCompiler.watch({ aggregateTimeout: 300 }, () => { });
    yield createCompilationPromise('server', multiCompiler, serverConfig);
    return promise;
});
