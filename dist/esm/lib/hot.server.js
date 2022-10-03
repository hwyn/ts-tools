import vm from 'vm';
import webpack from 'webpack';
import { createCompilationPromise } from './compilation';
import path from 'path';
import { platformConfig, webpackDevServer } from '../config';
import { requireSync } from '../core/fs';
import { isFunction, merge } from 'lodash';
const serverPlatform = platformConfig('server');
const { hotContext, outputPath } = serverPlatform;
export const hotServer = async () => {
    let vmContext;
    const contextSync = requireSync(hotContext);
    const hotVmContext = isFunction(contextSync) ? contextSync(serverPlatform) : contextSync;
    const serverConfig = webpackDevServer();
    const multiCompiler = webpack(serverConfig);
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
                    multiCompiler.outputFileSystem.readFile(path.join(outputPath, 'server.js'), (error, code) => {
                        const context = merge(hotVmContext, { ...global, require, process, console, global, Buffer });
                        vmContext = vm.createContext(context);
                        vm.runInContext(code.toString('utf-8'), vmContext);
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
    multiCompiler.watch({ aggregateTimeout: 300 }, () => { });
    await createCompilationPromise('server', multiCompiler, serverConfig);
    return promise;
};
