'use strict';

const location = require('../controllers/location.js');

module.exports = [
    { method: 'GET', path: '/api/locations/getall', config: { handler: location.getAll } },
    { method: 'GET', path: '/api/locations/test/{id?}', config: { auth: false, handler: location.test} },
    { method: 'POST', path: '/api/locations/savelocation', config: { handler: location.saveLocation } },
    { method: 'POST', path: '/api/locations/updatelocation', config: { handler: location.updateLocation } },
    { method: 'POST', path: '/api/locations/deletelocation', config: { handler: location.deleteLocation } }
];