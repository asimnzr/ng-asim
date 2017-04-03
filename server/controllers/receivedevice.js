'use strict';

const receiveDeviceDAL = require('../dal/receivedevice.js');

exports.getAll = function (request, reply) {
    receiveDeviceDAL.getAll(request, reply);
};

exports.getStatuses = function (request, reply) {
    receiveDeviceDAL.getStatuses(request, reply);
};

exports.getReceiveDeviceById = function (request, reply) {
    receiveDeviceDAL.getReceiveDeviceById(request, reply);
};

exports.saveReceiveDevice = function (request, reply) {
    receiveDeviceDAL.saveReceiveDevice(request, reply);
};

exports.updateReceiveDevice = function (request, reply) {
    receiveDeviceDAL.updateReceiveDevice(request, reply);
};

exports.updateReceiveDeviceStatus = function (request, reply) {
    receiveDeviceDAL.updateReceiveDeviceStatus(request, reply);
};

exports.deleteReceiveDevice = function (request, reply) {
    receiveDeviceDAL.deleteReceiveDevice(request, reply);
};

exports.test = function (request, reply) {
    receiveDeviceDAL.test(request, reply);
};
