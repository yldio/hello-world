const Hapi = require('hapi');
const Main = require('apr-main');

const { PORT = 3000, NODE_ENV = 'development', HOST = '0.0.0.0' } = process.env;

const server = Hapi.server({
  port: PORT,
  host: HOST
});

server.route({
  method: 'GET',
  path: '/',
  config: {
    handler: (request, h) =>
      h.response('{"hello": "world"}').type('application/json')
  }
});

Main(async () => {
  await server.start();
  console.log(`server started at http://localhost:${server.info.port}`);
});
