const Hapi = require('hapi');
const ReadMeta = require('./read-meta');
const Rollover = require('rollover');
const Main = require('apr-main');
const Penseur = require('penseur');
const { lookup } = require('mz/dns');
const Os = require('os');

const Heroes = require('./heroes.json');

const {
  PORT = 3000,
  NODE_ENV = 'development',
  HOST = '0.0.0.0',
  RDB_HOST = '0.0.0.0',
  RDB_PORT = 28015
} = process.env;

Main(async () => {
  const port = await ReadMeta('PORT', PORT);
  const host = await ReadMeta('HOST', HOST);
  const ROLLBAR_TOKEN = await ReadMeta('ROLLBAR_TOKEN');
  const rdb_host = await ReadMeta('RDB_HOST', RDB_HOST);
  const rdb_port = await ReadMeta('RDB_PORT', RDB_PORT);

  const db = new Penseur.Db('main', {
    host: rdb_host,
    port: rdb_port
  });

  await db.establish(['heroes']);

  await db.heroes.insert(Heroes);

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
      handler: async (request, h) => {
        const heroes = await db.heroes.all();
        return h.response(JSON.stringify(heroes)).type('application/json');
      }
    }
  });

  await server.start();

  const hostname = await lookup(Os.hostname(), 4);
  console.log(`server started at http://${hostname[0]}:${server.info.port}`);
});
