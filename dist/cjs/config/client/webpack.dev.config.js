"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const webpack_merge_1 = tslib_1.__importDefault(require("webpack-merge"));
const webpack_base_config_1 = tslib_1.__importDefault(require("./webpack.base.config"));
const happypack_1 = require("../../core/happypack");
const config_1 = require("../config");
const hotPlug = (key) => `webpack-hot-middleware/client?path=__webpack_hmr&name=${key}&reload=true&dynamicPublicPath=true`;
const { sourceMap, hasSourceMap } = (0, config_1.platformConfig)(config_1.PlatformEnum.client);
exports.default = () => {
    const config = (0, webpack_base_config_1.default)();
    const { entry } = config;
    const { output: { filename = '', chunkFilename = '' } = {} } = config;
    delete config.entry;
    return (0, happypack_1.happypackMerge)((0, webpack_merge_1.default)(config, {
        mode: 'development',
        entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
            [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [hotPlug(key), entry[key]],
        }), {}),
        output: {
            filename: typeof filename === 'string' ? filename.replace('\.[contenthash:8]', '') : filename,
            chunkFilename: typeof chunkFilename === 'string' ? chunkFilename.replace('\.[chunkhash:8]', '') : chunkFilename,
        },
        plugins: [
            new webpack_1.default.HotModuleReplacementPlugin(),
            new webpack_1.default.NoEmitOnErrorsPlugin()
        ],
        ...hasSourceMap ? { devtool: sourceMap } : {},
    }));
};
