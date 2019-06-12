"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _treeKill = _interopRequireDefault(require("tree-kill"));
var _chokidar = _interopRequireDefault(require("chokidar"));
var _child_process = require("child_process");
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const { baseDir, srcDir } = _config.config;
let host = 'localhost:3000';
let clearNodemon = () => Promise.resolve();
const delay = (timer, callback) => {
  let _delay = null;
  return () => !_delay && (_delay = setTimeout(() => callback().then(() => {
    _delay = null;
  }), timer));
};

const stdioPipe = (cp, pro) => {
  const stdio = fnName => (callback) =>
  cp[fnName].on('data', (data) =>
  pro[fnName].write(callback ? callback(data) || data : data));


  return {
    stdout: stdio('stdout'),
    stderr: stdio('stderr') };

};

function startServer() {
  const cp = (0, _child_process.spawn)('sh', ['-c', 'babel-node src/server/index.ts --extensions \'.ts,.tsx\''], {
    env: Object.assign({}, process.env, {
      PATH: `${baseDir}/node_modules/.bin:${process.env.PATH}` }) });


  const killCp = () => {
    _stdion = null;
    return new Promise((resolve, reject) => {
      (0, _treeKill.default)(cp.pid, err => err ? reject(err) : resolve());
    });
  };
  let _stdion = stdioPipe(cp, process);;
  _stdion.stderr();
  return new Promise((_resolve) =>
  _stdion.stdout(data => {
    const match = data.toString('utf-8').match(/http:\/\/(.*?)\//);
    if (match && match[1]) {
      host = match[1];
      _resolve(killCp);
    }
  }));

}

async function runNodemon() {
  let nodemonExa = await startServer();
  const watch = _chokidar.default.watch([_path.default.join(srcDir, 'server')], {});
  watch.on('change', delay(100, () => nodemonExa().
  then(startServer).
  then(exa => exa && (nodemonExa = exa))));
  return async () => nodemonExa().then(() => {
    watch.close();
  });
}

process.on('exit', () => clearNodemon());var _default =

async app => clearNodemon().then(() => clearNodemon = runNodemon()).then(() => host);exports.default = _default;