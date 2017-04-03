'use strict';
const Boom = require('boom');

function buildWhereClause(viewType) {
    var whereClause = {};

    var statuses = [];
    if (viewType === 'receivedevices') {
        whereClause = { deliverStatus: false }
    }
    if (viewType === 'communication') {
        whereClause = {
            deliverStatus: false,
            $or: [{ HardwareStatusId: { $notIn: [1, 2] }, SoftwareStatusId: 3 },
            { SoftwareStatusId: { $notIn: [1, 2] }, HardwareStatusId: 3 }
            ]
        };
    }
    if (viewType === 'fixing') {
        //1=Estimation, 2=working, 4=fixing, 5=Fixing Start, 8=Not communicated        
        whereClause = { deliverStatus: false, HardwareStatusId: { $in: [1, 2, 4, 5, 8] } };
    }
    return whereClause;
}

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const ReceiveDevice = db.sequelize.models.ReceiveDevice;
    const viewType = request.query.viewType;
    var models = [];
    models.push({ model: db.sequelize.models.Customer });
    models.push({ model: db.sequelize.models.Device, include: [db.sequelize.models.DeviceType] });
    ReceiveDevice.findAll({ include: models, where: buildWhereClause(viewType) })
        .then(function (receiveDevices) {
            return reply(receiveDevices);
        }).catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getStatuses = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db;
    const status = db.sequelize.models.Status;
    status.findAll()
        .then(function (statuses) {
            return reply(statuses);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getReceiveDeviceById = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const ReceiveDevice = db.sequelize.models.ReceiveDevice;
    const ReceiveDeviceAccessory = db.sequelize.models.ReceiveDeviceAccessory;
    const ReceiveDeviceMissingDevice = db.sequelize.models.ReceiveDeviceMissingDevice;
    const ReceiveDeviceProblem = db.sequelize.models.ReceiveDeviceProblem;
    const ReceiveDeviceEmployeeProblem = db.sequelize.models.ReceiveDeviceEmployeeProblem;
    const ReceiveDeviceCommunication = db.sequelize.models.ReceiveDeviceCommunication;
    const receiveDeviceId = request.query.receiveDeviceId;

    var models = [];
    models.push({ model: db.sequelize.models.Customer });
    models.push({ model: db.sequelize.models.Device, include: [db.sequelize.models.DeviceType] });
    models.push({ model: db.sequelize.models.Location });
    models.push({ model: db.sequelize.models.Employee, as: 'HardwareEmployee' });
    models.push({ model: db.sequelize.models.Status, as: 'HardwareStatus' });
    models.push({ model: db.sequelize.models.Employee, as: 'SoftwareEmployee' });
    models.push({ model: db.sequelize.models.Status, as: 'SoftwareStatus' });

    ReceiveDevice.findOne({
        where: { id: receiveDeviceId },
        include: models
    })
        .then(function (receiveDevice) {
            var foundReceiveDevice = receiveDevice.get();
            foundReceiveDevice.role = request.auth.credentials.role;
            // fetch accessories, if any
            ReceiveDeviceAccessory.findAll({
                where: { ReceiveDeviceId: receiveDevice.id },
                include: { model: db.sequelize.models.Accessory }
            }).then(function (receiveDeviceAccessories) { foundReceiveDevice.ReceiveDeviceAccessories = receiveDeviceAccessories; });
            // fetch missing devices, if any
            ReceiveDeviceMissingDevice.findAll({
                where: { ReceiveDeviceId: receiveDevice.id },
                include: { model: db.sequelize.models.MissingDevice }
            }).then(function (receiveDeviceMissingDevices) { foundReceiveDevice.ReceiveDeviceMissingDevices = receiveDeviceMissingDevices; });
            // fetch receive device problems, if any
            ReceiveDeviceProblem.findAll({
                where: { ReceiveDeviceId: receiveDevice.id },
                include: { model: db.sequelize.models.DeviceProblem }
            })
                .then(function (receiveDeviceProblems) {
                    foundReceiveDevice.ReceiveDeviceProblems = receiveDeviceProblems;
                });
            // fetch receive device employee problems, if any
            ReceiveDeviceEmployeeProblem.findAll({
                where: { ReceiveDeviceId: receiveDevice.id },
                include: { model: db.sequelize.models.DeviceProblem }
            })
                .then(function (receiveDeviceEmployeeProblems) {
                    foundReceiveDevice.ReceiveDeviceEmployeeProblems = receiveDeviceEmployeeProblems;
                });
            // fetch receive device communications, if any
            ReceiveDeviceCommunication.findAll({
                where: { ReceiveDeviceId: receiveDevice.id }
            })
                .then(function (ReceiveDeviceCommunications) {
                    foundReceiveDevice.ReceiveDeviceCommunications = ReceiveDeviceCommunications;
                    return reply(foundReceiveDevice);
                });
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveReceiveDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const ReceiveDevice = db.sequelize.models.ReceiveDevice;
    const ReceiveDeviceAccessory = db.sequelize.models.ReceiveDeviceAccessory;
    const ReceiveDeviceMissingDevice = db.sequelize.models.ReceiveDeviceMissingDevice;
    const ReceiveDeviceProblem = db.sequelize.models.ReceiveDeviceProblem;
    const receiveDeviceToSave = request.payload.receiveDevice;
    if (receiveDeviceToSave) {
        receiveDeviceToSave.createdBy = request.auth.credentials.id;
    }
    ReceiveDevice.create(receiveDeviceToSave)
        .then(function (savedReceiveDevice) {
            var id = savedReceiveDevice.get().id;
            var accessories = [];
            var missingDevices = [];
            var deviceProblems = [];
            // save accessories, if any
            if (receiveDeviceToSave.ReceiveDeviceAccessories) {
                receiveDeviceToSave.ReceiveDeviceAccessories.forEach(function (accessory, index) {
                    accessories.push({ ReceiveDeviceId: id, AccessoryId: accessory.id });
                });
                ReceiveDeviceAccessory.bulkCreate(accessories).then(function () { });
            }
            // save missing devices, if any
            if (receiveDeviceToSave.ReceiveDeviceMissingDevices) {
                receiveDeviceToSave.ReceiveDeviceMissingDevices.forEach(function (missingDevice, index) {
                    missingDevices.push({ ReceiveDeviceId: id, MissingDeviceId: missingDevice.id });
                });
                ReceiveDeviceMissingDevice.bulkCreate(missingDevices).then(function () { });
            }
            // save device problems, if any
            if (receiveDeviceToSave.ReceiveDeviceProblems) {
                receiveDeviceToSave.ReceiveDeviceProblems.forEach(function (deviceProblem, index) {
                    deviceProblems.push({ ReceiveDeviceId: id, detail: deviceProblem.detail, cost: deviceProblem.cost, serviceCharges: deviceProblem.serviceCharges, DeviceProblemId: deviceProblem.DeviceProblemId });
                });
                ReceiveDeviceProblem.bulkCreate(deviceProblems).then(function () { });
            }
            return reply(id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateReceiveDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const ReceiveDevice = db.sequelize.models.ReceiveDevice;
    const ReceiveDeviceHistory = db.sequelize.models.ReceiveDeviceHistory;
    const ReceiveDeviceAccessory = db.sequelize.models.ReceiveDeviceAccessory;
    const ReceiveDeviceMissingDevice = db.sequelize.models.ReceiveDeviceMissingDevice;
    const ReceiveDeviceProblem = db.sequelize.models.ReceiveDeviceProblem;
    const ReceiveDeviceEmployeeProblem = db.sequelize.models.ReceiveDeviceEmployeeProblem;
    const ReceiveDeviceCommunication = db.sequelize.models.ReceiveDeviceCommunication;
    var receiveDeviceToSave = request.payload.receiveDevice;
    if (receiveDeviceToSave) {
        receiveDeviceToSave.updatedBy = request.auth.credentials.id;
    }
    ReceiveDevice.update(receiveDeviceToSave, { where: { id: receiveDeviceToSave.id } })
        .then(function (updatedReceiveDevice) {
            var accessories = [];
            var missingDevices = [];
            var deviceProblems = [];
            var deviceEmployeeProblems = [];
            var customerCommunications = [];
            if (receiveDeviceToSave.ReceiveDeviceAccessories) {
                receiveDeviceToSave.ReceiveDeviceAccessories.forEach(function (accessory, index) {
                    accessories.push({ ReceiveDeviceId: receiveDeviceToSave.id, AccessoryId: accessory.id });
                });
            }
            if (receiveDeviceToSave.ReceiveDeviceMissingDevices) {
                receiveDeviceToSave.ReceiveDeviceMissingDevices.forEach(function (missingDevice, index) {
                    missingDevices.push({ ReceiveDeviceId: receiveDeviceToSave.id, MissingDeviceId: missingDevice.id });
                });
            }
            if (receiveDeviceToSave.ReceiveDeviceProblems) {
                receiveDeviceToSave.ReceiveDeviceProblems.forEach(function (deviceProblem, index) {
                    deviceProblems.push({ ReceiveDeviceId: receiveDeviceToSave.id, detail: deviceProblem.detail, cost: deviceProblem.cost, serviceCharges: deviceProblem.serviceCharges, DeviceProblemId: deviceProblem.DeviceProblemId });
                });
            }
            if (receiveDeviceToSave.ReceiveDeviceEmployeeProblems) {
                receiveDeviceToSave.ReceiveDeviceEmployeeProblems.forEach(function (deviceEmployeeProblem, index) {
                    deviceEmployeeProblems.push({ ReceiveDeviceId: receiveDeviceToSave.id, detail: deviceEmployeeProblem.detail, cost: deviceEmployeeProblem.cost, serviceCharges: deviceEmployeeProblem.serviceCharges, DeviceProblemId: deviceEmployeeProblem.DeviceProblemId });
                });
            }
            if (receiveDeviceToSave.ReceiveDeviceCommunications) {
                receiveDeviceToSave.ReceiveDeviceCommunications.forEach(function (customerCommunication, index) {
                    customerCommunications.push({ ReceiveDeviceId: receiveDeviceToSave.id, phoneNo: customerCommunication.phoneNo, communicationDate: customerCommunication.communicationDate, communcationTime: customerCommunication.communcationTime, details: customerCommunication.details });
                });
            }
            // remove and save accessories, if any
            ReceiveDeviceAccessory.destroy({ where: { ReceiveDeviceId: receiveDeviceToSave.id } }).then(function (affectedRows) { });
            ReceiveDeviceAccessory.bulkCreate(accessories).then(function () { });
            // remove and save missing devices, if any
            ReceiveDeviceMissingDevice.destroy({ where: { ReceiveDeviceId: receiveDeviceToSave.id } }).then(function (affectedRows) { });
            ReceiveDeviceMissingDevice.bulkCreate(missingDevices).then(function () { });
            // remove and save device problems, if any
            ReceiveDeviceProblem.destroy({ where: { ReceiveDeviceId: receiveDeviceToSave.id } }).then(function (affectedRows) { });
            ReceiveDeviceProblem.bulkCreate(deviceProblems).then(function () { });
            // remove and save device employee problems, if any
            ReceiveDeviceEmployeeProblem.destroy({ where: { ReceiveDeviceId: receiveDeviceToSave.id } }).then(function (affectedRows) { });
            ReceiveDeviceEmployeeProblem.bulkCreate(deviceEmployeeProblems).then(function () { });
            // remove and save customer communications, if any
            ReceiveDeviceCommunication.destroy({ where: { ReceiveDeviceId: receiveDeviceToSave.id } }).then(function (affectedRows) { });
            ReceiveDeviceCommunication.bulkCreate(customerCommunications).then(function () { });
            // adding receive device history record
            ReceiveDevice.findOne({
                where: { id: receiveDeviceToSave.id }
            })
                .then(function (receiveDevice) {
                    var rdh = receiveDevice._previousDataValues;
                    if (rdh.id) {
                        delete rdh.id;
                    }
                    rdh.ReceiveDeviceId = receiveDeviceToSave.id;
                    ReceiveDeviceHistory.create(rdh)
                        .then(function (savedHistory) {

                        })
                        .catch(function (err) {
                            return reply(Boom.badData(err));
                        });
                })
                .catch(function (err) {
                    return reply(Boom.badData(err));
                });

            return reply('Receive device updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateReceiveDeviceStatus = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const ReceiveDevice = db.sequelize.models.ReceiveDevice;
    const ReceiveDeviceHistory = db.sequelize.models.ReceiveDeviceHistory;
    var receiveDeviceToUpdate = {};

    receiveDeviceToUpdate.id = request.payload.receiveDeviceId;
    receiveDeviceToUpdate.updatedBy = request.auth.credentials.id;
    if (request.auth.credentials.role === 'SOFTWARETECHNICIAN') {
        receiveDeviceToUpdate.SoftwareStatusId = request.payload.newStatusId;
    }
    if (request.auth.credentials.role === 'HARDWARETECHNICIAN') {
        receiveDeviceToUpdate.HardwareStatusId = request.payload.newStatusId;
    }

    ReceiveDevice.update(receiveDeviceToUpdate, { where: { id: receiveDeviceToUpdate.id } })
        .then(function (updatedReceiveDevice) {
            // adding receive device history record
            ReceiveDevice.findOne({
                where: { id: receiveDeviceToUpdate.id }
            })
                .then(function (receiveDevice) {
                    var rdh = receiveDevice._previousDataValues;
                    if (rdh.id) {
                        delete rdh.id;
                    }
                    rdh.ReceiveDeviceId = receiveDeviceToUpdate.id;
                    ReceiveDeviceHistory.create(rdh)
                        .then(function (savedHistory) {

                        })
                        .catch(function (err) {
                            return reply(Boom.badData(err));
                        });
                })
                .catch(function (err) {
                    return reply(Boom.badData(err));
                });
            return reply('Action performed');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteReceiveDevice = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const ReceiveDevice = db.sequelize.models.ReceiveDevice;
    const receiveDeviceId = request.payload.receiveDeviceId;
    ReceiveDevice.destroy({ where: { id: receiveDeviceId } })
        .then(function (receiveDevice) {
            return reply('Receive Device deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    db.sequelize.sync().then(function () { reply('all db models synched') });
};