import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { sourceMap, hasSourceMap } = platformConfig(PlatformEnum.serverEntry);
export default () => {
    return happypackMerge(merge(baseConfig(), Object.assign({ mode: 'development', watch: true, devtool: false }, hasSourceMap ? { devtool: sourceMap } : {})), { excludeLoader: ['css-loader'] });
};
