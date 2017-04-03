'use strict';
const Boom = require('boom');

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const location = db.sequelize.models.Location;
    location.findAll()
        .then(function (locations) {
            return reply(locations);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveLocation = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const location = db.sequelize.models.Location;
    const locationToSave = request.payload.location;
    if (locationToSave) {
        locationToSave.createdBy = request.auth.credentials.id;
    }
    location.create(locationToSave)
        .then(function (location) {
            return reply(location.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateLocation = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const location = db.sequelize.models.Location;
    const locationToSave = request.payload.location;
    if (locationToSave) {
        locationToSave.updatedBy = request.auth.credentials.id;
    }
    location.update(locationToSave, { where: { id: locationToSave.id } })
        .then(function (location) {
            return reply('Location updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteLocation = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const location = db.sequelize.models.Location;
    const locationId = request.payload.locationId;
    location.destroy({ where: { id: locationId } })
        .then(function (location) {
            return reply('Location deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const location = db.sequelize.models.Location;
    location.sync().then(function () {
        location.create({
            name: 'Location' + request.query.id,
        }).then(function (cust) {
            return cust;
        }).catch(function (err) {
            console.log('Error occured' + err);
        });
    });
};
