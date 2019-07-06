"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _express = _interopRequireDefault(require("express"));
var _config = require("../config");
var _nodemon = _interopRequireDefault(require("./nodemon.server"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}

const { buildDir } = _config.config;var _default = /*#__PURE__*/function () {var _ref = _asyncToGenerator(

  function* (app) {
    app.use(_express.default.static(_path.default.resolve(buildDir, '/public')));
    return yield (0, _nodemon.default)(app);
  });return function (_x) {return _ref.apply(this, arguments);};}();exports.default = _default;