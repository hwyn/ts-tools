import { __awaiter } from "tslib";
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default () => __awaiter(void 0, void 0, void 0, function* () {
    return merge(yield baseConfig(), {
        mode: 'development',
        node: {
            __filename: true,
            __dirname: true
        }
    });
});
