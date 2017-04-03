'use strict';

const employeeDal = require('../dal/employee.js');

exports.getAll = function (request, reply) {
    employeeDal.getAll(request, reply)
};

exports.searchEmployees = function (request, reply) {
    employeeDal.searchEmployees(request, reply)
};

exports.getCount = function (request, reply) {
    employeeDal.getCount(request, reply)
};

exports.getPage = function (request, reply) {
    employeeDal.getPage(request, reply)
};

exports.getEmployeeById = function (request, reply) {
    employeeDal.getEmployeeById(request, reply);
};

exports.saveEmployee = function (request, reply) {
    employeeDal.saveEmployee(request, reply);
};

exports.updateEmployee = function (request, reply) {
    employeeDal.updateEmployee(request, reply);
};

exports.deleteEmployee = function (request, reply) {
    employeeDal.deleteEmployee(request, reply);
};

exports.test = function (request, reply) {
    reply(employeeDal.test(request));
};