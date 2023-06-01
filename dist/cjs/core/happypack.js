"use strict";
// import HappyPack  from 'happypack';
// import merge from 'webpack-merge';
// import os from 'os';
// import { Configuration, RuleSetRule as Rule, WebpackPluginInstance as Plugin } from 'webpack';
Object.defineProperty(exports, "__esModule", { value: true });
exports.happypackMerge = void 0;
const happypackMerge = (config, options) => {
    return config;
    // const happyPackConfig: any = config.module.rules.reduce((o: any, rule: any, index: number) => {
    //   const happyPackUtil = new HappyPackUtil(index, rule, options);
    //   happyPackUtil.addRulePulugins(o.module.rules, o.plugins);
    //   return o;
    // }, { module: { rules: [] }, plugins: [] });
    // delete config.module.rules;
    // return merge(config, happyPackConfig);
};
exports.happypackMerge = happypackMerge;
