"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.happypackMerge = void 0;
const tslib_1 = require("tslib");
const happypack_1 = (0, tslib_1.__importDefault)(require("happypack"));
const webpack_merge_1 = (0, tslib_1.__importDefault)(require("webpack-merge"));
const os_1 = (0, tslib_1.__importDefault)(require("os"));
const happyThreadPool = happypack_1.default.ThreadPool({ size: os_1.default.cpus().length });
class HappyPackUtil {
    rule;
    id;
    threads;
    constructor(threads, rule) {
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
            use.filter((item) => item.loader && exclude.includes(item.loader)).length);
    }
    getHappyPackRule() {
        const { use, loader, options, ...__rules } = this.rule;
        return {
            ...__rules,
            use: `happypack/loader?id=${this.id}`,
        };
    }
    getHappyPackPlugin() {
        const { use, loader, options } = this.rule;
        const { id } = this;
        const _use = use || [{
                loader,
                options,
            }];
        return new happypack_1.default(Object.assign({
            id,
            threadPool: happyThreadPool,
            loaders: _use,
        }));
    }
    addRulePulugins(rules, plugins) {
        if (this.isCanHappyPack()) {
            rules.push(this.getHappyPackRule());
            plugins.push(this.getHappyPackPlugin());
        }
        else {
            rules.push(this.rule);
        }
    }
}
const happypackMerge = (config) => {
    const happyPackConfig = config.module.rules.reduce((o, rule, index) => {
        const happyPackUtil = new HappyPackUtil(index, rule);
        happyPackUtil.addRulePulugins(o.module.rules, o.plugins);
        return o;
    }, { module: { rules: [] }, plugins: [] });
    delete config.module.rules;
    return (0, webpack_merge_1.default)(config, happyPackConfig);
};
exports.happypackMerge = happypackMerge;
