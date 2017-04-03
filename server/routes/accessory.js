'use strict';

const accessory = require('../controllers/accessory.js');

module.exports = [
    { method: 'GET', path: '/api/accessories/getall', config: { handler: accessory.getAll } },
    { method: 'GET', path: '/api/accessories/test/{id?}', config: { auth: false, handler: accessory.test} },
    { method: 'POST', path: '/api/accessories/saveaccessory', config: { handler: accessory.saveAccessory } },
    { method: 'POST', path: '/api/accessories/updateaccessory', config: { handler: accessory.updateAccessory } },
    { method: 'POST', path: '/api/accessories/deleteaccessory', config: { handler: accessory.deleteAccessory } }
];