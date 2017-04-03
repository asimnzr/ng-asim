'use strict';
const Boom = require('boom');

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const accessory = db.sequelize.models.Accessory;
    accessory.findAll()
        .then(function (accessories) {
            return reply(accessories);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveAccessory = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const accessory = db.sequelize.models.Accessory;
    const accessoryToSave = request.payload.accessory;
    if (accessoryToSave) {
        accessoryToSave.createdBy = request.auth.credentials.id;
    }
    accessory.create(accessoryToSave)
        .then(function (accessory) {
            return reply(accessory.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateAccessory = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const accessory = db.sequelize.models.Accessory;
    const accessoryToSave = request.payload.accessory;
    if (accessoryToSave) {
        accessoryToSave.updatedBy = request.auth.credentials.id;
    }
    accessory.update(accessoryToSave, { where: { id: accessoryToSave.id } })
        .then(function (accessory) {
            return reply('Accessory updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteAccessory = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const accessory = db.sequelize.models.Accessory;
    const accessoryId = request.payload.accessoryId;
    accessory.destroy({ where: { id: accessoryId } })
        .then(function (accessory) {
            return reply('Accessory deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const accessory = db.sequelize.models.Accessory;
    accessory.sync().then(function () {
        accessory.create({
            name: 'Accessory' + request.query.id,
        }).then(function (accessory) {
            return accessory;
        }).catch(function (err) {
            console.log('Error occured' + err);
        });
    });
};
