import { __awaiter } from "tslib";
import merge from 'webpack-merge';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const { tsConfig } = platformConfig(PlatformEnum.server);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    process.env.TS_NODE_PROJECT = tsConfig;
    return merge(yield baseConfig(), {});
});
