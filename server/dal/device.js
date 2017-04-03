'use strict';
const Boom = require('boom');

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const device = db.sequelize.models.Device;
    const deviceType = db.sequelize.models.DeviceType;
    device.findAll({
        include: [deviceType]
    })
        .then(function (devices) {
            return reply(devices);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.searchDevices = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const device = db.sequelize.models.Device;
    const deviceType = db.sequelize.models.DeviceType;
    const query = request.query.searchText;
    var criteria = [
        {
            brand: { $iLike: '%' + query + '%' }
        },
        {
            series: { $iLike: '%' + query + '%' }
        },
        {
            model: { $iLike: '%' + query + '%' }
        }
    ];
    deviceType.findAll({ where: { name: { $iLike: '%' + query + '%' } } })
        .then(function (deviceTypes) {
            var ids = [];
            deviceTypes.forEach(function (deviceType) {
                ids.push(deviceType.id);
            }, this);
            if (ids.length) {
                criteria.push({ DeviceTypeId: { $in: ids } });
            }
            console.log(criteria);
            device.findAll({
                include: [deviceType],
                where: {
                    $or: criteria
                }
            })
                .then(function (devices) {
                    return reply(devices);
                })
                .catch(function (err) {
                    return reply(Boom.badData(err));
                });
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const device = db.sequelize.models.Device;
    const deviceToSave = request.payload.device;
    if (deviceToSave) {
        deviceToSave.createdBy = request.auth.credentials.id;
    }
    device.create(deviceToSave)
        .then(function (savedDevice) {
            return reply(savedDevice.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const device = db.sequelize.models.Device;
    const deviceToSave = request.payload.device;
    if (deviceToSave) {
        deviceToSave.updatedBy = request.auth.credentials.id;
    }
    device.update(deviceToSave, { where: { id: deviceToSave.id } })
        .then(function (savedDevice) {
            return reply('Device updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const device = db.sequelize.models.Device;
    const deviceId = request.payload.deviceId;
    device.destroy({ where: { id: deviceId } })
        .then(function (deletedDevice) {
            return reply('Device deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const device = db.sequelize.models.Device;
    device.sync().then(function () {
        // device.create({
        //     brand: 'Device' + request.query.id ? request.query.id : 1,
        // }).then(function(deviceProb) {
        //     return deviceProb;
        // }).catch(function(err) {
        //     console.log('Error occured' + err);
        // });
    });
};
