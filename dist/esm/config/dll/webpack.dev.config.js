import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default () => merge(baseConfig(), {
    mode: 'production',
});
