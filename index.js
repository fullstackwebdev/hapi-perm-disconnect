const hapi = require('hapi');
const perm = require('hapi-perm');
const Boom = require('boom');

const server = hapi.server({ port: 31337 });

const init = async () => {
    await server.register({
        plugin: perm,
        options: {
            password: '',
            db: '',
            timeout: 1,
            //queryTimeout: 1,
            pingInterval: 1
        }
    });
    server.route({
        method: 'GET',
        path: '/',
        async handler(request) {
            const { db, r } = request.server;
            let tables;
            try {
                tables = await db(r.table('users'));

            } catch (error) {
                console.log(error);
                return Boom.notAcceptable(error.message);
            }
            return tables;
        }
    });
    await server.start();
    console.log('Server ready:', server.info.uri);
};

init();
