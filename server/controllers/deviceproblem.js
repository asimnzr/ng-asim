'use strict';

const deviceProblemDAL = require('../dal/deviceproblem.js');

exports.getAll = function (request, reply) {
    deviceProblemDAL.getAll(request, reply);
};

exports.saveDeviceProblem = function (request, reply) {
    deviceProblemDAL.saveDeviceProblem(request, reply);
};

exports.updateDeviceProblem = function (request, reply) {
    deviceProblemDAL.updateDeviceProblem(request, reply);
};

exports.deleteDeviceProblem = function (request, reply) {
    deviceProblemDAL.deleteDeviceProblem(request, reply);
};

exports.getProblemTypes = function (request, reply) {
    deviceProblemDAL.getProblemTypes(request, reply);
};

exports.test = function (request) {
    deviceProblemDAL.test(request);
};
