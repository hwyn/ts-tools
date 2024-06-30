import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';
export default (function () { return merge(baseConfig(), {
    mode: 'development'
}); });
