import HappyPack  from 'happypack';
import merge from 'webpack-merge';
import os from 'os';
import { Configuration,  Rule, Plugin } from 'webpack';

const happyThreadPool = (HappyPack as any).ThreadPool({ size: os.cpus().length });
class HappyPackUtil {
  private rule: Rule;
  private id: string;
  private threads: number;
  constructor(threads: number, rule: Rule) {
    this.rule = rule;
    this.threads = threads + 1;
    this.id = `happypack${this.threads}`;
  }

  isCanHappyPack(): boolean {
    const { loader, use=[] } = this.rule;
    const exclude = ['@ngtools/webpack'];
    if (!loader || !use || (use as any).length) {
      return false;
    }
    return !(exclude.includes(loader as string) || (use as any).filter((item: any) => item.loader && exclude.includes(item.loader)).length);
  }

  getHappyPackRule(): Rule {
    const { use, loader, options, ...__rules } = this.rule;
    return {
      ...__rules,
      use: `happypack/loader?id=${this.id}`,
    };
  }

  getHappyPackPlugin(): Plugin {
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

  addRulePulugins(rules: Rule[], plugins: Plugin[]) {
    if (this.isCanHappyPack()) {
      rules.push(this.getHappyPackRule());
      plugins.push(this.getHappyPackPlugin());
    } else {
      rules.push(this.rule);
    }
  }
} 


export const happypackMerge = (config: Configuration): Configuration => {
  const happyPackConfig = config.module.rules.reduce((o: any, rule: Rule, index: number) => {
    const happyPackUtil = new HappyPackUtil(index, rule);
    happyPackUtil.addRulePulugins(o.module.rules, o.plugins);
    return o;
  }, { module: { rules: [] }, plugins: [] });

  delete config.module.rules;

  return merge(config, happyPackConfig);
};