import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { tsConfig } = platformConfig(PlatformEnum.server);
export default () => {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(baseConfig(), {});
};
