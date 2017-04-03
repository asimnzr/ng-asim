'use strict';

const deviceDAL = require('../dal/device.js');

exports.getAll = function(request, reply) {
    deviceDAL.getAll(request, reply);
};

exports.searchDevices = function(request, reply) {
    deviceDAL.searchDevices(request, reply);
};

exports.saveDevice = function(request, reply) {
    deviceDAL.saveDevice(request, reply);
};

exports.updateDevice = function(request, reply) {
    deviceDAL.updateDevice(request, reply);
};

exports.deleteDevice = function(request, reply) {
    deviceDAL.deleteDevice(request, reply);
};

exports.test = function(request) {
    deviceDAL.test(request);
};
