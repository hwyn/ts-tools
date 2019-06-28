import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';

export default (): Configuration => {
  const config = baseConfig();
  return merge(config, {
    mode: 'development',
    devtool: false,
  });
}
