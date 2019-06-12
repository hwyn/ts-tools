import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';

export default () => merge(baseConfig(), {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
  ]
});
