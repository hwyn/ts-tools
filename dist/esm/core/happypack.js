import HappyPack from 'happypack';
import merge from 'webpack-merge';
import os from 'os';
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
class HappyPackUtil {
    rule;
    id;
    threads;
    excludeLoader;
    constructor(threads, rule, options = {}) {
        this.rule = rule;
        this.threads = threads + 1;
        this.id = `happypack${this.threads}`;
        this.excludeLoader = options.excludeLoader || [];
    }
    isCanHappyPack() {
        const { loader, use = [] } = this.rule;
        const exclude = this.excludeLoader;
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
        return new HappyPack(Object.assign({
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
export const happypackMerge = (config, options) => {
    return config;
    const happyPackConfig = config.module.rules.reduce((o, rule, index) => {
        const happyPackUtil = new HappyPackUtil(index, rule, options);
        happyPackUtil.addRulePulugins(o.module.rules, o.plugins);
        return o;
    }, { module: { rules: [] }, plugins: [] });
    delete config.module.rules;
    return merge(config, happyPackConfig);
};
