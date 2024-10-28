import 'zone.js/dist/zone-node';
import * as https from 'https';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import 'localstorage-polyfill';
import { sessionStorage } from 'sessionstorage';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
const domino = require('domino');
const fs = require('fs');
const path = require('path');
const templateA = fs
  .readFileSync(path.join('dist/gtrweb/browser', 'index.html'))
  .toString();
const win = domino.createWindow(templateA);
win.Object = Object;
win.Math = Math;
global['window'] = win;
global['document'] = win.document;
global['branch'] = null;
global['object'] = win.object;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;
global['localStorage'] = win.localStorage;
global['sessionStorage'] = win.sessionStorage;
global['Event'] = win.Event;

global['Event']['prototype'] = win.Event.prototype;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.enable('trust proxy');
  server.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
  });
  const distFolder = join(process.cwd(), 'dist/gtrweb/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  server.get('/api/**', (req, res) => { 
    res.send("Hello from server")
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 443;

  // https certificates
  const privateKey = fs.readFileSync(
    '/home/ubuntu/www.ghanatalksradio.com_private_key.key'
  );
  const certificate = fs.readFileSync(
    '/home/ubuntu/www.ghanatalksradio.com_ssl_certificate.cer'
  );
  // Start up the Node server
  const server = https.createServer(
    { key: privateKey, cert: certificate },
    app()
  );

  server.listen(port, () => {
    console.log(`Node Express server listening on https://localhost:${port}`);
  });
  const server2 = app();
  server2.listen(80, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
