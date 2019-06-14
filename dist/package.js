"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _fs = _interopRequireWildcard(require("fs"));
var _path = _interopRequireDefault(require("path"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}}newObj.default = obj;return newObj;}}







const baseDir = process.cwd();

function getAssets() {
  const assets = JSON.parse(_fs.default.readFileSync(_path.default.join(baseDir, 'build/assets.json'), { encoding: 'utf-8' }));
  let dll = {};
  if ((0, _fs.existsSync)(_path.default.join(baseDir, '../../build/dll.json'))) {
    dll = JSON.parse(_fs.default.readFileSync(_path.default.join(baseDir, 'build/dll.json'), { encoding: 'utf-8' }));
  }
  return {
    ...dll,
    ...assets };

}

const serializationSource = source => Object.keys(source).reduce((o, key) => {
  let __source;
  if (!key || !(__source = source[key])) {
    return o;
  }
  const javascript = [].concat(__source.js || []).map(path => `<script src="/${path}"></script>`);
  const styleSheet = [].concat(__source.css || []).map(path => `<link rel="stylesheet" href="/${path}">`);
  return Object.assign({
    javascript: o.javascript.concat(javascript),
    styleSheet: o.styleSheet.concat(styleSheet) });

}, { javascript: [], styleSheet: [] });

const getResource = (() => {
  let json;
  return () => json ? json : json = serializationSource(getAssets());
})();var _default =

getResource;exports.default = _default;