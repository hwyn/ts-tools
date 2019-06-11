import fs from 'fs';
import path from 'path';

export interface Source<T> {
  javascript: Array<T>;
  styleSheet: Array<T>;
}

type serialization = () => Source<string>;

function getAssets() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../build/assets.json'), { encoding: 'utf-8' }));
}

const serializationSource = (source: any) => ['runtime', 'polyfill', 'main'].reduce((o: Source<string>, key): Source<string> => {
  let __source;
  if (!key || !(__source = source[key])) {
    return o as Source<string>;
  }
  const javascript = [].concat(__source.js || []).map((path: string) => `<script src="/${path}"></script>`);
  const styleSheet = [].concat(__source.css || []).map((path: string) => `<link rel="stylesheet" href="/${path}">`);
  return Object.assign({
    javascript: o.javascript.concat(javascript),
    styleSheet: o.styleSheet.concat(styleSheet),
  });
}, { javascript:[], styleSheet: [] } as Source<string>);

const getResource = ((): serialization => {
  let json: Source<string>;
  return (): Source<string> => json ? json : json = serializationSource(getAssets());
})();

export default getResource;
