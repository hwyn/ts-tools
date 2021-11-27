import webpack from 'webpack';
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import baseConfig from './webpack.base.config';
export default () => {
    return happypackMerge(merge(baseConfig(), {
        mode: 'development',
        watch: true,
        devtool: false,
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("development"),
                }
            }),
        ]
    }), { excludeLoader: ['css-loader'] });
};
