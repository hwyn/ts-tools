"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.happypackMerge = void 0;var _happypack = _interopRequireDefault(require("happypack"));
var _webpackMerge = _interopRequireDefault(require("webpack-merge"));
var _os = _interopRequireDefault(require("os"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}


const happyThreadPool = _happypack.default.ThreadPool({ size: _os.default.cpus().length });
class HappyPackUtil {



  constructor(threads, rule) {_defineProperty(this, "rule", void 0);_defineProperty(this, "id", void 0);_defineProperty(this, "threads", void 0);
    this.rule = rule;
    this.threads = threads + 1;
    this.id = `happypack${this.threads}`;
  }

  isCanHappyPack() {
    const { loader, use = [] } = this.rule;
    const exclude = ['@ngtools/webpack', '@angular-devkit/build-optimizer/webpack-loader'];
    if (!loader && (!use || !use.length)) {
      return false;
    }
    return !(loader && exclude.includes(loader) ||
    use.filter(item => item.loader && exclude.includes(item.loader)).length);
  }

  getHappyPackRule() {
    const { use, loader, options, ...__rules } = this.rule;
    return {
      ...__rules,
      use: `happypack/loader?id=${this.id}` };

  }

  getHappyPackPlugin() {
    const { use, loader, options } = this.rule;
    const { id } = this;
    const _use = use || [{
      loader,
      options }];

    return new _happypack.default(Object.assign({
      id,
      threadPool: happyThreadPool,
      loaders: _use }));

  }

  addRulePulugins(rules, plugins) {
    if (this.isCanHappyPack()) {
      rules.push(this.getHappyPackRule());
      plugins.push(this.getHappyPackPlugin());
    } else {
      rules.push(this.rule);
    }
  }}



const happypackMerge = config => {
  const happyPackConfig = config.module.rules.reduce((o, rule, index) => {
    const happyPackUtil = new HappyPackUtil(index, rule);
    happyPackUtil.addRulePulugins(o.module.rules, o.plugins);
    return o;
  }, { module: { rules: [] }, plugins: [] });

  delete config.module.rules;
  return (0, _webpackMerge.default)(config, happyPackConfig);
};exports.happypackMerge = happypackMerge;