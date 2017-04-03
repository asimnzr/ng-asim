'use strict';

const deviceProblem = require('../controllers/deviceproblem.js');

module.exports = [
    { method: 'GET', path: '/api/deviceproblems/getall', config: { handler: deviceProblem.getAll } },
    { method: 'GET', path: '/api/deviceproblems/getproblemtypes', config: { handler: deviceProblem.getProblemTypes } },
    { method: 'GET', path: '/api/deviceproblems/test/{id?}', config: { auth: false, handler: deviceProblem.test } },
    // { method: 'GET', path: '/api/deviceproblems/test', config: { auth: false, handler: function(request, response){
    //     const db = request.server.plugins['hapi-sequelize'].db;
    //     const deviceProblem = db.sequelize.models.DeviceProblem;
    // db.sequelize.sync().then(function () {
    //         console.log('models synched');
    //     
    //     // deviceProblem.create({
    //     //     name: 'Location' + request.query.id,
    //     // }).then(function (deviceProb) {
    //     //     return deviceProb;
    //     // }).catch(function (err) {
    //     //     console.log('Error occured' + err);
    //     // });
    // });
    // }
    // } },
    { method: 'POST', path: '/api/deviceproblems/savedeviceproblem', config: { handler: deviceProblem.saveDeviceProblem } },
    { method: 'POST', path: '/api/deviceproblems/updatedeviceproblem', config: { handler: deviceProblem.updateDeviceProblem } },
    { method: 'POST', path: '/api/deviceproblems/deletedeviceproblem', config: { handler: deviceProblem.deleteDeviceProblem } }
];