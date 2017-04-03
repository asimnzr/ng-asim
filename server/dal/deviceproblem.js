'use strict';
const Boom = require('boom');

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceProblem = db.sequelize.models.DeviceProblem;
    const problemType = db.sequelize.models.ProblemType;
    deviceProblem.findAll({
        include: [problemType]
    })
        .then(function (deviceProblems) {
            return reply(deviceProblems);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveDeviceProblem = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceProblem = db.sequelize.models.DeviceProblem;
    const deviceProblemToSave = request.payload.deviceProblem;
    if (deviceProblemToSave) {
        deviceProblemToSave.createdBy = request.auth.credentials.id;
    }
    deviceProblem.create(deviceProblemToSave)
        .then(function (deviceProblem) {
            return reply(deviceProblem.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateDeviceProblem = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceProblem = db.sequelize.models.DeviceProblem;
    const deviceProblemToSave = request.payload.deviceProblem;
    if (deviceProblemToSave) {
        deviceProblemToSave.updatedBy = request.auth.credentials.id;
    }
    deviceProblem.update(deviceProblemToSave, { where: { id: deviceProblemToSave.id } })
        .then(function (deviceProb) {
            return reply('Device Problem updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteDeviceProblem = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceProblem = db.sequelize.models.DeviceProblem;
    const deviceProblemId = request.payload.deviceProblemId;
    deviceProblem.destroy({ where: { id: deviceProblemId } })
        .then(function (deviceProb) {
            return reply('Device Problem deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getProblemTypes = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const problemType = db.sequelize.models.ProblemType;
    problemType.findAll()
        .then(function (problemTypes) {
            return reply(problemTypes);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const deviceProblem = db.sequelize.models.DeviceProblem;
    deviceProblem.sync().then(function () {
        deviceProblem.create({
            name: 'Device Problem' + request.query.id ? request.query.id : 1,
        }).then(function (deviceProb) {
            return deviceProb;
        }).catch(function (err) {
            console.log('Error occured' + err);
        });
    });
};
