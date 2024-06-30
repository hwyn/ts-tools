import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default (function (entryKey) { return merge(baseConfig(entryKey), {
    mode: 'production',
}); });
