'use strict';
const Boom = require('boom');
const Bcrypt = require('bcryptjs');

function getRoles(request) {
    var roles = [];
    if (request.auth.credentials.role === 'SUPERADMIN') {
        roles = ['ADMIN', 'SOFTWARETECHNICIAN', 'HARDWARETECHNICIAN'];
    }
    if (request.auth.credentials.role === 'ADMIN') {
        roles = ['SOFTWARETECHNICIAN', 'HARDWARETECHNICIAN'];
    }
    return roles;
}

exports.getAllUsers = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const user = db.sequelize.models.User;

    user.findAll({
            attributes: ['id', 'email', 'username', 'role'],
            where: {
                role: { $in: getRoles(request) }
            }
        })
        .then(function(users) {
            return reply(users);
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.getAllRoles = function(request, reply) {
    return reply(getRoles(request));
};

exports.saveUser = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const user = db.sequelize.models.User;
    const userToSave = request.payload.user;
    if (userToSave) {
        //userToSave.createdBy = request.auth.credentials.id;
    }
    var salt = Bcrypt.genSaltSync(10);
    var hash = Bcrypt.hashSync(request.payload.user.password, salt);
    userToSave.password = hash;
    user.create(userToSave)
        .then(function(user) {
            return reply(user.id);
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.updateUser = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const user = db.sequelize.models.User;
    const userToSave = request.payload.user;
    if (userToSave) {
        //userToSave.updatedBy = request.auth.credentials.id;
    }
    user.update(userToSave, { where: { id: userToSave.id } })
        .then(function(user) {
            return reply('User updated successfully!');
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteUser = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const user = db.sequelize.models.User;
    const userId = request.payload.userId;
    user.destroy({ where: { id: userId } })
        .then(function(deletedUser) {
            return reply('User deleted successfully!');
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.setPassword = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const user = db.sequelize.models.User;
    const userToSave = request.payload.user;
    if (userToSave) {
        //userToSave.createdBy = request.auth.credentials.id;
    }
    var salt = Bcrypt.genSaltSync(10);
    var hash = Bcrypt.hashSync(request.payload.user.password, salt);
    userToSave.password = hash;
    user.update(userToSave, { where: { id: userToSave.id } })
        .then(function(user) {
            return reply('User password set successfully!');
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};