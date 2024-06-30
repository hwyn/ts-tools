import { __assign } from "tslib";
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
var _a = platformConfig(PlatformEnum.serverEntry), sourceMap = _a.sourceMap, hasSourceMap = _a.hasSourceMap;
export default (function () {
    return happypackMerge(merge(baseConfig(), __assign({ mode: 'development', watch: true, devtool: false }, hasSourceMap ? { devtool: sourceMap } : {})), { excludeLoader: ['css-loader'] });
});
