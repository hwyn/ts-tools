import webpackClient from './client/webpack.prod.config';
import webpackDevClient from './client/webpack.dev.config';
import webpackServer from './server/webpack.prod.config';
import webpackDevServer from './server/webpack.dev.config';
import webpackDll from './dll/webpack.prod.config';
import webpackDevDll from './dll/webpack.dev.config';
import webpackServerEntry from './server-entry/webpack.prod.config';
import webpackDevServerEntry from './server-entry/webpack.dev.config';
import config from './config';

export {
  webpackClient,
  webpackDevClient,
  webpackServer,
  webpackDevServer,
  webpackDll,
  webpackDevDll,
  webpackServerEntry,
  webpackDevServerEntry,
  config,
}
