'use strict';

module.exports = [
    { method: 'GET', path: '/{path*}', handler: function(request, reply) { reply.view('angular.template.html', { isAdmin: request.auth.credentials.role === 'ADMIN' || request.auth.credentials.role === 'SUPERADMIN' }); } },
    { method: 'GET', path: '/temp', handler: function(request, reply) { reply(request.auth.credentials); } },
    { method: 'GET', path: '/app/{path*}', handler: { directory: { path: './public/app', listing: false, index: true } } },
    { method: 'GET', path: '/app/styles/{path*}', config: { auth: false, handler: { directory: { path: './public/app/styles', listing: false, index: true } } } },
    { method: 'GET', path: '/bower_components/{path*}', config: { auth: false, handler: { directory: { path: './public/bower_components', listing: false, index: true } } } },
    { method: 'GET', path: '/images/{path*}', handler: { directory: { path: './server/images', listing: false, index: true } } },
];