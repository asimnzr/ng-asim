'use strict';

const locationDal = require('../dal/location.js');

exports.getAll = function (request, reply) {
    locationDal.getAll(request, reply);
};

exports.saveLocation = function (request, reply) {
   locationDal.saveLocation(request, reply);
};

exports.updateLocation = function (request, reply) {
    locationDal.updateLocation(request, reply);
};

exports.deleteLocation = function (request, reply) {
   locationDal.deleteLocation(request, reply);
};

exports.test = function (request) {
    locationDal.test(request);
};
