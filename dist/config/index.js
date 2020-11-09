"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _exportNames = { webpackClient: true, webpackDevClient: true, webpackServer: true, webpackDevServer: true, webpackDll: true, webpackDevDll: true, webpackServerEntry: true, webpackDevServerEntry: true };Object.defineProperty(exports, "webpackClient", { enumerable: true, get: function () {return _webpackProd.default;} });Object.defineProperty(exports, "webpackDevClient", { enumerable: true, get: function () {return _webpackDev.default;} });Object.defineProperty(exports, "webpackServer", { enumerable: true, get: function () {return _webpackProd2.default;} });Object.defineProperty(exports, "webpackDevServer", { enumerable: true, get: function () {return _webpackDev2.default;} });Object.defineProperty(exports, "webpackDll", { enumerable: true, get: function () {return _webpackProd3.default;} });Object.defineProperty(exports, "webpackDevDll", { enumerable: true, get: function () {return _webpackDev3.default;} });Object.defineProperty(exports, "webpackServerEntry", { enumerable: true, get: function () {return _webpackProd4.default;} });Object.defineProperty(exports, "webpackDevServerEntry", { enumerable: true, get: function () {return _webpackDev4.default;} });var _webpackProd = _interopRequireDefault(require("./client/webpack.prod.config"));
var _webpackDev = _interopRequireDefault(require("./client/webpack.dev.config"));
var _webpackProd2 = _interopRequireDefault(require("./server/webpack.prod.config"));
var _webpackDev2 = _interopRequireDefault(require("./server/webpack.dev.config"));
var _webpackProd3 = _interopRequireDefault(require("./dll/webpack.prod.config"));
var _webpackDev3 = _interopRequireDefault(require("./dll/webpack.dev.config"));
var _webpackProd4 = _interopRequireDefault(require("./server-entry/webpack.prod.config"));
var _webpackDev4 = _interopRequireDefault(require("./server-entry/webpack.dev.config"));












var _config = require("./config");Object.keys(_config).forEach(function (key) {if (key === "default" || key === "__esModule") return;if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;if (key in exports && exports[key] === _config[key]) return;Object.defineProperty(exports, key, { enumerable: true, get: function () {return _config[key];} });});function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}