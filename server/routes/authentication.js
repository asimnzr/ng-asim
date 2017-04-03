'use strict';

const authentication = require('../controllers/authentication.js');

module.exports = [
    { method: ['GET', 'POST'], path: '/login', config: { handler: authentication.login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },
    { method: 'GET', path: '/api/auth/logout', config: { handler: authentication.logout } },
    { method: 'POST', path: '/api/auth/changepassword', config: { handler: authentication.changePassword } },
    { method: 'GET', path: '/api/auth/register', config: { auth: false, handler: authentication.register } },
    { method: 'GET', path: '/soft', config: { plugins: { 'hapiAuthorization': { role: 'SOFTWARETECHNICIAN' } }, handler: function(request, reply) { return reply('software route'); } } },
    { method: 'GET', path: '/hard', config: { plugins: { 'hapiAuthorization': { role: 'HARDWARETECHNICIAN' } }, handler: function(request, reply) { return reply('hardware route'); } } },
    { method: 'GET', path: '/api/auth/users/getall', config: { handler: authentication.getAllUsers } },
    { method: 'GET', path: '/api/auth/roles/getall', config: { handler: authentication.getAllRoles } },
    { method: 'POST', path: '/api/auth/users/updateuser', config: { handler: authentication.updateUser } },
    { method: 'POST', path: '/api/auth/users/saveuser', config: { handler: authentication.saveUser } },
    { method: 'POST', path: '/api/auth/users/deleteuser', config: { handler: authentication.deleteUser } },
    { method: 'POST', path: '/api/auth/users/setpassword', config: { handler: authentication.setPassword } }
];