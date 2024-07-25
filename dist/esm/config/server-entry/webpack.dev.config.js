import { __awaiter } from "tslib";
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { sourceMap, hasSourceMap } = platformConfig(PlatformEnum.serverEntry);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return happypackMerge(merge(yield baseConfig(), Object.assign({ mode: 'development', watch: true, devtool: false }, hasSourceMap ? { devtool: sourceMap } : {})), { excludeLoader: ['css-loader'] });
});
