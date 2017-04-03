'use strict';

const deviceTypeDAL = require('../dal/devicetype.js');

exports.getAll = function(request, reply) {
    deviceTypeDAL.getAll(request, reply);
};

exports.saveDeviceType = function(request, reply) {
    deviceTypeDAL.saveDeviceType(request, reply);
};

exports.updateDeviceType = function(request, reply) {
    deviceTypeDAL.updateDeviceType(request, reply);
};

exports.deleteDeviceType = function(request, reply) {
    deviceTypeDAL.deleteDeviceType(request, reply);
};

exports.test = function(request) {
    deviceTypeDAL.test(request);
};

