import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.base.config';
import config from '../config';

const { isDebug } = config;

export default (): Configuration => merge(baseConfig(), {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: isDebug,
        cache: true,
        parallel: true,
        uglifyOptions: {
          safari10: true,
          output: {
            ascii_only: true,
            comments: false,
            webkit: true,
          },
          compress: {
            pure_getters: true,
            passes: 3,
            inline: 3,
          }
        }
      }),
    ],
  },
});
