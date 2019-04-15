import * as express from 'express';
import * as serveIndex from 'serve-index';

const port = 9000;

const app = express();
app.use(express.static('www'));
app.use(serveIndex('www', { icons: true }));
app.listen(port, () => console.log('Server started on port', port));


