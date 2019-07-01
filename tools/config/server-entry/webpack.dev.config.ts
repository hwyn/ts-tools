import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import baseConfig from './webpack.base.config';

export default (): Configuration => {
  const config = baseConfig();
  return happypackMerge(merge(config, {
    mode: 'development',
    watch: true,
    devtool: false,
  }));
}
