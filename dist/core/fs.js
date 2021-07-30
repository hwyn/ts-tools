"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.requireSync = exports.writeFile = exports.mkdir = exports.cleanDir = exports.exists = void 0;var _rimraf = _interopRequireDefault(require("rimraf"));
var _fs = require("fs");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

const exists = (path) => {
  return Promise.resolve((0, _fs.existsSync)(path));
};exports.exists = exists;

const cleanDir = /*#__PURE__*/function () {var _ref = _asyncToGenerator(function* (path, options) {return new Promise((resolve, reject) => {
      if (!(0, _fs.existsSync)(path)) {
        return resolve();
      }
      (0, _rimraf.default)(path, { glob: options }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });});return function cleanDir(_x, _x2) {return _ref.apply(this, arguments);};}();exports.cleanDir = cleanDir;

const mkdir = /*#__PURE__*/function () {var _ref2 = _asyncToGenerator(function* (path, options) {return cleanDir(path).then(() => {
      return new Promise((resolve, reject) => {
        (0, _fs.mkdir)(path, Object.assign({ recursive: true }, options), (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });});return function mkdir(_x3, _x4) {return _ref2.apply(this, arguments);};}();exports.mkdir = mkdir;


const writeFile = /*#__PURE__*/function () {var _ref3 = _asyncToGenerator(function* (path, data, options) {
    let _code = data;
    if (data instanceof String) {
      _code = new Buffer(data);
    }
    return new Promise((resolve, reject) => {
      (0, _fs.writeFile)(path, _code, Object.assign({ encoding: 'utf-8' }, options), (err) => {
        if (err) {
          return reject();
        }
        resolve(path);
      });
    });
  });return function writeFile(_x5, _x6, _x7) {return _ref3.apply(this, arguments);};}();exports.writeFile = writeFile;

const requireSync = (path) => {
  if (!(0, _fs.existsSync)(path)) {
    return;
  }
  return require(path);
};exports.requireSync = requireSync;