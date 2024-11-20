const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert')
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
    });

    await server.register(Inert);

    server.route(routes);

    await server.start();
    console.log(`server ini berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();