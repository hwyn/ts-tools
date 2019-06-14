import webpack, { Rule, Plugin } from 'webpack';
import merge from 'webpack-merge';
import HappyPack from 'happypack';
import baseConfig from './webpack.base.config';

const hotPlug = (key: string) => `webpack-hot-middleware/client?name=${key}&reload=true`;

export default () => {
  const config = baseConfig();
  const rules = config.module.rules;
  const _rules: Rule[] = [];
  const _plugins: Plugin[] = []; 
  rules.forEach((rule: Rule, index: number) => {
    const { use, ...__rules } = rule;
    const id = `happypack${index}`;
    _rules.push({
      ...__rules,
      use: `happypack/loader?id=${id}`
    });
    _plugins.push(new HappyPack({
      id,
      threads: index + 1,
      loaders: use,
    }));
  });
  
  const entry = config.entry;
  delete config.entry;
  delete config.module.rules;
  console.log(rules);
  console.log(_rules);
  console.log(_plugins);
  return merge(config, {
    mode: 'development',
    entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
      [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [entry[key], hotPlug(key)],
    }), {}),
    output: {
      filename: config.output.filename.replace('\.[hash:8]', ''),
    },
    module: {
      rules: _rules,
    },
    plugins: [
      ..._plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'development'"
      }),
    ],
    devtool: 'source-map',
  });
}
