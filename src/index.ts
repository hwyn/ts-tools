import path from 'path';
import express from 'express';
import serializationSource, { Source } from './serializationSource';
console.log(express);
const app = express();
console.log('static');
app.use(express.static(path.resolve(__dirname, '../build/public')));
console.log('get');
app.get('*', async (req, res, next): Promise<void> => {
  const source: Source<string> = serializationSource();
  res.write(`<html><head><title>title</title>`);
  res.write(`<base href="/">`);
  res.write(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
  res.write(source.styleSheet.join(''));
  res.write(`</head><body>`);
  res.write(source.javascript.join(''));
  res.write(`</body></html>`);
  res.end();
});
console.log('listen');
app.listen('3000', () => {
  console.log('The server is running at http://localhost:3000/');
});
