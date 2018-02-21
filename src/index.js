const Hapi = require('hapi');
const Penseur = require('penseur');
const Intercept = require('apr-intercept');
const Main = require('apr-main');

const Heroes = require('./heroes.json');
const ReadMeta = require('./read-meta');

const {
  PORT = 80,
  NODE_ENV = 'development',
  HOST = '0.0.0.0',
  DB_HOST = '0.0.0.0',
  RDB_PORT = 28015
} = process.env;

Main(async () => {
  // get database hostname from metadata
  const db_host = await ReadMeta('DB_HOST', DB_HOST);

  const db = new Penseur.Db('main', {
    host: db_host,
    port: RDB_PORT
  });

  // try to connect to db
  const [err1] = await Intercept(db.establish(['heroes']));
  if (err1) console.error(err1);

  if (db.heroes) {
    // try to insert values into db
    const [err2] = await Intercept(db.heroes.insert(Heroes));
    if (err2) console.error(err2);
  }

  const server = Hapi.server({
    port: PORT,
    host: HOST
  });

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: async (request, h) => {
        let heroes = {};

        if (db.heroes) {
          const [err3, res] = await Intercept(db.heroes.all());
          if (err3) console.error(err1);
          if (!err3) heroes = res;
        } else {
          heroes = Heroes;
        }

        return h.response(JSON.stringify(heroes)).type('application/json');
      }
    }
  });

  await server.start();

  console.log(`server started at http://${HOST}:${server.info.port}`);
});
