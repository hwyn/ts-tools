"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.requireSync = exports.writeFile = exports.mkdir = exports.cleanDir = exports.exists = void 0;var _rimraf = _interopRequireDefault(require("rimraf"));
var _fs = require("fs");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const exists = path => {
  return Promise.resolve((0, _fs.existsSync)(path));
};exports.exists = exists;

const cleanDir = async (path, options = {}) => new Promise((resolve, reject) => {
  if (!(0, _fs.existsSync)(path)) {
    return resolve();
  }
  (0, _rimraf.default)(path, { glob: options }, err => {
    if (err) {
      return reject(err);
    }
    resolve();
  });
});exports.cleanDir = cleanDir;

const mkdir = async (path, options = {}) => cleanDir(path).then(() => {
  return new Promise((resolve, reject) => {
    (0, _fs.mkdir)(path, Object.assign({ recursive: true }, options), err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
});exports.mkdir = mkdir;


const writeFile = async (path, data, options = {}) => {
  let _code = data;
  if (data instanceof String) {
    _code = new Buffer(data);
  }
  return new Promise((resolve, reject) => {
    (0, _fs.writeFile)(path, _code, Object.assign({ encoding: 'utf-8' }, options), err => {
      if (err) {
        return reject();
      }
      resolve(path);
    });
  });
};exports.writeFile = writeFile;

const requireSync = path => {
  if (!(0, _fs.existsSync)(path)) {
    return;
  }
  const moduleRequire = require(path);
  return moduleRequire;
};exports.requireSync = requireSync;