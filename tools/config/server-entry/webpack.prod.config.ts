import webpack, { HashedModuleIdsPlugin, DllReferencePlugin } from 'webpack';
import merge from 'webpack-merge';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.base.config';

export default () => merge(baseConfig(), {
  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new HashedModuleIdsPlugin(),
      new UglifyJSPlugin({
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
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
  ]
});
