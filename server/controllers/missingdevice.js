'use strict';

const missingDeviceDAL = require('../dal/missingdevice.js');

exports.getAll = function (request, reply) {
    missingDeviceDAL.getAll(request, reply);
};

exports.saveMissingDevice = function (request, reply) {
    missingDeviceDAL.saveMissingDevice(request, reply);
};

exports.updateMissingDevice = function (request, reply) {
    missingDeviceDAL.updateMissingDevice(request, reply);
};

exports.deleteMissingDevice = function (request, reply) {
    missingDeviceDAL.deleteMissingDevice(request, reply);
};

exports.test = function (request) {
    missingDeviceDAL.test(request);
};
