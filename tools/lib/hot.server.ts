import vm from 'vm';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { createCompilationPromise } from './compilation';
import path from 'path';
import { platformConfig, webpackDevServer } from '../config';
import { requireSync } from '../core/fs';
import { isFunction, merge } from 'lodash';

const serverPlatform = platformConfig('server');
const { hotContext, outputPath } = serverPlatform;

export const hotServer = async () => {
  let vmContext: any;
  const contextSync = requireSync(hotContext);
  const hotVmContext = isFunction(contextSync) ? contextSync(serverPlatform) : contextSync;
  const serverConfig = webpackDevServer();
  const multiCompiler = webpack(serverConfig);
  const { fileSystem } = webpackDevMiddleware(multiCompiler, { logLevel: 'silent' });
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
          const code = fileSystem.readFileSync(path.join(outputPath, 'server.js'), 'utf-8');
          const context = merge({ ...global, require, process, console, global }, hotVmContext);
          vmContext = vm.createContext(context);
          vm.runInContext(code, vmContext);
        }
      } catch (e) {
        console.log(e);
        clearInterval(interval);
        reject(null);
      }
    });
  });
  await createCompilationPromise('server', multiCompiler, serverConfig);

  return promise;
};
