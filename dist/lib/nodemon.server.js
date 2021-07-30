"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _treeKill = _interopRequireDefault(require("tree-kill"));
var _chokidar = _interopRequireDefault(require("chokidar"));
var _child_process = require("child_process");
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}


const { main, watchFile, root, tsConfig } = (0, _config.platformConfig)('server');
const entryFile = main;

let host = `localhost:${process.env.PORT || 3000}`;
let clearNodemon = () => Promise.resolve();
const delay = (timer, callback) => {
  let _delay = null;
  const clearDely = () => _delay = null;
  return () => !_delay && (_delay = setTimeout(() => callback().then(clearDely).catch(clearDely), timer));
};

const stdioPipe = (cp, pro) => {
  const stdio = (fnName) => (callback) =>
  cp[fnName].on('data', (data) => pro[fnName].write(callback ? callback(data) || data : data));

  return {
    stdout: stdio('stdout'),
    stderr: stdio('stderr') };

};

const getSpawnArgs = () => {
  const platform = process.platform;
  const spawnArgs = [];
  let spawnFlags = [];
  const spawnOptions = {
    env: { ...process.env, PATH: `${root}/node_modules/.bin:${process.env.PATH}` } };

  if (platform === 'win32') {
    spawnArgs.push(process.env.ComSpec || 'cmd.exe');
    spawnFlags = ['/d', '/s', '/c'];
    spawnOptions.windowsVerbatimArguments = true;
  } else {
    spawnArgs.push('sh');
    spawnFlags.push('-c');
  }

  spawnFlags.push(`ts-node --project ${tsConfig} -r tsconfig-paths/register ${entryFile}`);
  spawnArgs.push(spawnFlags);
  spawnArgs.push(spawnOptions);
  process.env.TS_NODE_PROJECT = tsConfig;
  return spawnArgs;
};

function startServer() {
  const cp = _child_process.spawn.apply(null, getSpawnArgs());
  const killCp = () => {
    _stdion = null;
    return new Promise((resolve, reject) => {
      (0, _treeKill.default)(cp.pid, 'SIGKILL', (err) => err ? reject(err) : resolve());
    });
  };
  let _stdion = stdioPipe(cp, process);
  return new Promise((_resolve, _reject) => {
    let count = 0;
    _stdion.stderr(() => _reject(killCp));
    if (!_config.existenceClient) {
      _resolve(killCp);
    }
    _stdion.stdout((data) => {
      if (_config.existenceClient) {
        const match = data.toString('utf-8').match(/(http|tcp|udp):\/\/(.*?)\//);
        if (match && match[2] && count === 0) {
          host = match[2];
          _resolve(killCp);
          count++;
        }
      }
    });
  });
}function

runNodemon() {return _runNodemon.apply(this, arguments);}function _runNodemon() {_runNodemon = _asyncToGenerator(function* () {
    let nodemonExa;
    const watch = _chokidar.default.watch(Array.isArray(watchFile) ? watchFile : [watchFile], {});
    const finallServer = () => startServer().then((exa) => exa && (nodemonExa = exa)).catch((exa) => exa && (nodemonExa = exa));
    const watchClose = () => watch.close();
    try {
      nodemonExa = yield startServer();
    } catch (e) {
      nodemonExa = e;
    } finally {
      watch.on('change', delay(100, () => {
        console.log(`server reset run......`);
        return nodemonExa().then(finallServer).catch(finallServer);
      }));
    }
    return () => nodemonExa().then(watchClose).catch(watchClose);
  });return _runNodemon.apply(this, arguments);}

process.on('SIGINT', () => process.exit(1));
process.on('exit', () => clearNodemon());var _default =

() => clearNodemon().then(runNodemon).then((clear) => clearNodemon = clear).then(() => {
  if (host) {
    return host;
  }
  throw new Error(`server run fail`);
});exports.default = _default;