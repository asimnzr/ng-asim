'use strict';

const Bcrypt = require('bcryptjs');
const Boom = require('boom');
const authenticationDAL = require('../dal/authentication.js');

var uuid = 183928;

exports.login = function(request, reply) {
    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    if (request.method === 'get') {
        return reply.view('login.form.html', { errorMessage: '' });
    }

    if (request.method === 'post') {
        if (!request.payload.username || !request.payload.password) {
            return reply.view('login.form.html', { errorMessage: 'Missing username or password' });
        } else {
            var models = request.server.plugins['hapi-sequelize'].db.sequelize.models;
            models.User.findOne({ where: { username: request.payload.username } })
                .then(function(user) {
                    if (!user) {
                        return reply.view('login.form.html', { errorMessage: 'Invalid username or password' });
                    } else {
                        if (!Bcrypt.compareSync(request.payload.password, user.password)) {
                            return reply.view('login.form.html', { errorMessage: 'Invalid username or password' });
                        } else {
                            const sid = String(++uuid);
                            request.server.app.cache.set(sid, { account: user }, 0, (err) => {
                                if (err) {
                                    reply(err);
                                }
                                request.cookieAuth.set({ sid: sid });
                                return reply.view('angular.template.html', { isAdmin: user.role === 'ADMIN' || user.role === 'SUPERADMIN' });
                            });
                        }
                    }
                });
        }
    }
};

exports.logout = function(request, reply) {
    request.cookieAuth.clear();
    return reply.redirect('/login');
};

exports.changePassword = function(request, reply) {
    if (request.payload.user.newPassword !== request.payload.user.confirmPassword) {
        return reply(Boom.conflict('New Password and Confirm Password dont match!'));
    }
    const db = request.server.plugins['hapi-sequelize'].db
    const user = db.sequelize.models.User;
    user.findOne({ where: { username: request.auth.credentials.username } })
        .then(function(fetchedUser) {
            if (!Bcrypt.compareSync(request.payload.user.oldPassword, fetchedUser.password)) {
                return reply(Boom.conflict('Invalid Old Password!'));
            } else {
                var salt = Bcrypt.genSaltSync(10);
                var hash = Bcrypt.hashSync(request.payload.user.newPassword, salt);
                var userToUpdate = {};
                userToUpdate.password = hash;
                user.update(userToUpdate, { where: { id: fetchedUser.id } })
                    .then(function(savedUser) {
                        request.cookieAuth.clear();
                        return reply('Password changed successfully!');
                    })
                    .catch(function(err) {
                        console.log('error');
                        return reply(Boom.badData(err));
                    });
            }
        });
};

exports.register = function(request, reply) {
    var models = request.server.plugins['hapi-sequelize'].db.sequelize.models;
    var db = request.server.plugins['hapi-sequelize'].db;
    db.sequelize.sync().then(function() {
        models.User.findAll({
            attributes: [
                [db.sequelize.fn('COUNT', db.sequelize.col('email')), 'userCount']
            ]
        }).then(function(counts) {
            var count = +counts[0].dataValues.userCount;
            if (count === 0) {
                var salt = Bcrypt.genSaltSync(10);
                var hash = Bcrypt.hashSync('pass', salt);
                models.User.create({
                        username: 'akbar',
                        password: hash,
                        email: 'example@example.com',
                        role: 'SUPERADMIN'
                    })
                    .then(function(user) {
                        console.log('user created with id ' + user.id);
                    })
                    .catch(function(err) {
                        console.log('Error occured' + err);
                    });
            } else {
                console.log('no user created the existing count is ' + count);
            }
        });
    });
    reply();
};

exports.getAllUsers = function(request, reply) {
    authenticationDAL.getAllUsers(request, reply);
};

exports.getAllRoles = function(request, reply) {
    authenticationDAL.getAllRoles(request, reply);
};

exports.updateUser = function(request, reply) {
    authenticationDAL.updateUser(request, reply);
};

exports.saveUser = function(request, reply) {
    authenticationDAL.saveUser(request, reply);
};

exports.deleteUser = function(request, reply) {
    authenticationDAL.deleteUser(request, reply);
};

exports.setPassword = function(request, reply) {
    authenticationDAL.setPassword(request, reply);
};