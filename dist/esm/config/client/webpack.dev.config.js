import { __awaiter } from "tslib";
import webpack from 'webpack';
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import { platformConfig, PlatformEnum } from '../config';
import baseConfig from './webpack.base.config';
const hotPlug = (key) => `webpack-hot-middleware/client?path=__webpack_hmr&name=${key}&reload=true&dynamicPublicPath=true`;
const { sourceMap, hasSourceMap } = platformConfig(PlatformEnum.client);
export default () => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield baseConfig();
    const { entry } = config;
    const { output: { filename = '', chunkFilename = '' } = {} } = config;
    delete config.entry;
    return happypackMerge(merge(config, Object.assign({ mode: 'development', entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
            [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [hotPlug(key), entry[key]],
        }), {}), output: {
            filename: typeof filename === 'string' ? filename.replace('\.[contenthash:8]', '') : filename,
            chunkFilename: typeof chunkFilename === 'string' ? chunkFilename.replace('\.[chunkhash:8]', '') : chunkFilename,
        }, plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ] }, hasSourceMap ? { devtool: sourceMap } : {})));
});
