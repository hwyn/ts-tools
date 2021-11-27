import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
import { happypackMerge } from '../../core/happypack';
import { platformConfig } from '../config';
const hotPlug = (key) => `webpack-hot-middleware/client?name=${key}&reload=true`;
const { sourceMap, hasSourceMap } = platformConfig('client');
export default () => {
    const config = baseConfig();
    const { entry } = config;
    const { output: { filename = '' } = {} } = config;
    delete config.entry;
    return happypackMerge(merge(config, {
        mode: 'development',
        entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
            [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [hotPlug(key), entry[key]],
        }), {}),
        output: {
            filename: typeof filename === 'string' ? filename.replace('\.[contenthash:8]', '') : filename,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("development"),
                }
            }),
        ],
        ...hasSourceMap ? { devtool: sourceMap } : {},
    }));
};
