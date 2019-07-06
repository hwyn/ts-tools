"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _treeKill = _interopRequireDefault(require("tree-kill"));
var _chokidar = _interopRequireDefault(require("chokidar"));
var _child_process = require("child_process");
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

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

}function

runNodemon() {return _runNodemon.apply(this, arguments);}function _runNodemon() {_runNodemon = _asyncToGenerator(function* () {
    let nodemonExa = yield startServer();
    const watch = _chokidar.default.watch([_path.default.join(srcDir, 'server')], {});
    watch.on('change', delay(100, () => nodemonExa().
    then(startServer).
    then(exa => exa && (nodemonExa = exa))));
    return (/*#__PURE__*/_asyncToGenerator(function* () {return nodemonExa().then(() => {
          watch.close();
        });}));
  });return _runNodemon.apply(this, arguments);}

process.on('exit', () => clearNodemon());var _default = /*#__PURE__*/function () {var _ref = _asyncToGenerator(

  function* (app) {return clearNodemon().then(() => clearNodemon = runNodemon()).then(() => host);});return function (_x) {return _ref.apply(this, arguments);};}();exports.default = _default;