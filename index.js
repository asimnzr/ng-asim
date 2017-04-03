'use strict';

const Path = require('path');
const Hapi = require('hapi');

const routes = require('./server/routes/routes.js');
const plugins = require('./server/config/plugins.js');

const server = new Hapi.Server();

server.connection({ port: 8000 });
server.register(plugins, (err) => {

    if (err) {
        throw err;
    }

    const cache = server.cache({ segment: 'sessions', expiresIn: 1 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;
    server.auth.strategy('session', 'cookie', true, {
        password: 'P@ssw0rd-$hould-BE-32-Characters',
        cookie: 'sessionCookie',
        redirectTo: '/login',
        isSecure: false,
        //appendNext: true,
        validateFunc: function (request, session, callback) {

            cache.get(session.sid, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
        }
    });

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './server/templates'
    });
    server.route(routes);

    // var sequelize = server.plugins['hapi-sequelize'].db.sequelize;
    // if (sequelize) {
    //     sequelize.addHook('beforeCreate', function (model, options, fn) {
    //         console.log('before create hook the user id is ' + options);
    //     });
    // }

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});

