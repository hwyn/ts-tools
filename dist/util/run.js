"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _path = _interopRequireDefault(require("path"));
var _config = require("../config");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


const arvg = process.argv;

_config.ProjectConfig.load(arvg);
function run(fn, options) {
  const task = typeof fn.default === 'undefined' ? fn : fn.default;
  return task(options);
}

if (require.main === module || require.main === module.parent && arvg.length > 2) {
  delete require.cache[__filename];
  const { default: exports } = require(`${_path.default.join(__dirname, arvg.slice(2)[0])}`);
  run(exports);
}var _default =

run;exports.default = _default;