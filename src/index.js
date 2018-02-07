const Hapi = require('hapi');
const ReadMeta = require('./read-meta');
const Rollover = require('rollover');
const Main = require('apr-main');
const { lookup } = require('mz/dns');
const Os = require('os');


const { PORT = 3000, NODE_ENV = 'development', HOST = '0.0.0.0' } = process.env;

Main(async () => {
  const port = await ReadMeta('PORT', PORT);
  const host = await ReadMeta('HOST', HOST);
  const ROLLBAR_TOKEN = await ReadMeta('ROLLBAR_TOKEN');

  const server = Hapi.server({
    port,
    host
  });

  await server.register({
    plugin: Rollover,
    options: {
      rollbar: {
        accessToken: ROLLBAR_TOKEN,
        reportLevel: 'error'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: (request, h) =>
        h.response('{"hello": "world"}').type('application/json')
    }
  });

  await server.start();

  const hostname = await lookup(Os.hostname(), 4);
  console.log(`server started at http://${hostname[0]}:${server.info.port}`);
});
