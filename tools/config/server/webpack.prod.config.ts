import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';

export default (): Configuration => merge(baseConfig(), { });
