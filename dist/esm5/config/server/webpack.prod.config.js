import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var tsConfig = platformConfig(PlatformEnum.server).tsConfig;
export default (function () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(baseConfig(), {});
});
