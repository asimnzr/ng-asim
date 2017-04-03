'use strict';
const Boom = require('boom');

exports.getAll = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceType = db.sequelize.models.DeviceType;
    deviceType.findAll()
        .then(function(deviceTypes) {
            return reply(deviceTypes);
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.saveDeviceType = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceType = db.sequelize.models.DeviceType;
    const deviceTypeToSave = request.payload.deviceType;
    if (deviceTypeToSave) {
        deviceTypeToSave.createdBy = request.auth.credentials.id;
    }
    deviceType.create(deviceTypeToSave)
        .then(function(deviceType) {
            return reply(deviceType.id);
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.updateDeviceType = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceType = db.sequelize.models.DeviceType;
    const deviceTypeToSave = request.payload.deviceType;
    if (deviceTypeToSave) {
        deviceTypeToSave.updatedBy = request.auth.credentials.id;
    }
    deviceType.update(deviceTypeToSave, { where: { id: deviceTypeToSave.id } })
        .then(function(deviceTyp) {
            return reply('Device Type updated successfully!');
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteDeviceType = function(request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceType = db.sequelize.models.DeviceType;
    const deviceTypeId = request.payload.deviceTypeId;
    deviceType.destroy({ where: { id: deviceTypeId } })
        .then(function(deviceTyp) {
            return reply('Device Type deleted successfully!');
        })
        .catch(function(err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function(request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceType = db.sequelize.models.DeviceType;
    deviceType.sync().then(function() {
        deviceType.create({
            name: 'Device Type' + request.query.id ? request.query.id : 1,
        }).then(function(deviceTyp) {
            return deviceTyp;
        }).catch(function(err) {
            console.log('Error occured' + err);
        });
    });
};
