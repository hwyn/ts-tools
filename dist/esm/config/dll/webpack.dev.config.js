import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default (entryKey) => merge(baseConfig(entryKey), {
    mode: 'production',
});
