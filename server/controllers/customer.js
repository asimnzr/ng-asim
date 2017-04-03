'use strict';

const customerDal = require('../dal/customer.js');

exports.getAll = function(request, reply) {
    customerDal.getAll(request, reply)
};

exports.searchCustomers = function(request, reply) {
    customerDal.searchCustomers(request, reply)
};

exports.getCount = function(request, reply) {
    customerDal.getCount(request, reply)
};

exports.getPage = function(request, reply) {
    customerDal.getPage(request, reply)
};

exports.getCustomerById = function(request, reply) {
    customerDal.getCustomerById(request, reply);
};

exports.saveCustomer = function(request, reply) {
    customerDal.saveCustomer(request, reply);
};

exports.updateCustomer = function(request, reply) {
    customerDal.updateCustomer(request, reply);
};

exports.deleteCustomer = function(request, reply) {
    customerDal.deleteCustomer(request, reply);
};

exports.saveCustomerPhone = function(request, reply) {
    customerDal.saveCustomerPhone(request, reply);
};

exports.updateCustomerPhone = function(request, reply) {
    customerDal.updateCustomerPhone(request, reply);
};

exports.deleteCustomerPhone = function(request, reply) {
    customerDal.deleteCustomerPhone(request, reply);
};

exports.test = function(request, reply) {
    reply(customerDal.test(request));
};