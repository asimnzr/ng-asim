'use strict';

const accessoryDAL = require('../dal/accessory.js');

exports.getAll = function (request, reply) {
    accessoryDAL.getAll(request, reply);
};

exports.saveAccessory = function (request, reply) {
    accessoryDAL.saveAccessory(request, reply);
};

exports.updateAccessory = function (request, reply) {
    accessoryDAL.updateAccessory(request, reply);
};

exports.deleteAccessory = function (request, reply) {
    accessoryDAL.deleteAccessory(request, reply);
};

exports.test = function (request) {
    accessoryDAL.test(request);
};
