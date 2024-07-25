import { __awaiter } from "tslib";
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default (entryKey) => __awaiter(void 0, void 0, void 0, function* () {
    return merge(yield baseConfig(entryKey), {
        mode: 'production',
    });
});
