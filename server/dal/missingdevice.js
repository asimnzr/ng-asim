'use strict';
const Boom = require('boom');

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const MissingDevice = db.sequelize.models.MissingDevice;
    MissingDevice.findAll()
        .then(function (MissingDevices) {
            return reply(MissingDevices);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveMissingDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const MissingDevice = db.sequelize.models.MissingDevice;
    const missingDeviceToSave = request.payload.missingDevice;
    if (missingDeviceToSave) {
        missingDeviceToSave.createdBy = request.auth.credentials.id;
    }
    MissingDevice.create(missingDeviceToSave)
        .then(function (missingDevice) {
            return reply(missingDevice.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateMissingDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const MissingDevice = db.sequelize.models.MissingDevice;
    const missingDeviceToSave = request.payload.missingDevice;
    if (missingDeviceToSave) {
        missingDeviceToSave.updatedBy = request.auth.credentials.id;
    }
    MissingDevice.update(missingDeviceToSave, { where: { id: missingDeviceToSave.id } })
        .then(function (missingDevice) {
            return reply('Missing Device updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteMissingDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const MissingDevice = db.sequelize.models.MissingDevice;
    const missingDeviceId = request.payload.missingDeviceId;
    MissingDevice.destroy({ where: { id: missingDeviceId } })
        .then(function (missingDevice) {
            return reply('Missing Device deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const MissingDevice = db.sequelize.models.MissingDevice;
    MissingDevice.sync().then(function () {
        MissingDevice.create({
            name: 'Missing Device' + request.query.id,
        }).then(function (missingDevice) {
            return missingDevice;
        }).catch(function (err) {
            console.log('Error occured' + err);
        });
    });
};
