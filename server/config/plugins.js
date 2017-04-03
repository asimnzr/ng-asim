'use strict';

const db = require('./db.json');

module.exports = [
    {
        register: require('hapi-sequelize'),
        options: db
    },
    {
        register: require('inert'),
        options: {
        }
    },
    {
        register: require('hapi-auth-cookie'),
        options: {
        }
    },
    {
        register: require('hapi-authorization'),
        options: {
            roles: ['SUPERADMIN', 'ADMIN', 'SOFTWARETECHNICIAN', 'HARDWARETECHNICIAN'] // Can also reference a function which returns an array of roles
        }
    },
    {
        register: require('vision'),
        options: {
        }
    }
];