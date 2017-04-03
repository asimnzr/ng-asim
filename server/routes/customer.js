'use strict';
const customer = require('../controllers/customer.js');

module.exports = [
    //{ method: 'GET', path: '/register', config: { auth: false, handler: authentication.register } },
    { method: 'GET', path: '/api/customers/getall', config: { handler: customer.getAll } },
    { method: 'GET', path: '/api/customers/searchcustomers/{searchText?}', config: { handler: customer.searchCustomers } },
    { method: 'GET', path: '/api/customers/test', config: { handler: customer.test } },
    { method: 'GET', path: '/api/customers/getcount/{searchText?}', config: { handler: customer.getCount } },
    { method: 'POST', path: '/api/customers/getpage', config: { handler: customer.getPage } },
    { method: 'GET', path: '/api/customers/getcustomerbyid/{customerId?}', config: { handler: customer.getCustomerById } },
    { method: 'POST', path: '/api/customers/savecustomer', config: { handler: customer.saveCustomer } },
    { method: 'POST', path: '/api/customers/updatecustomer', config: { handler: customer.updateCustomer } },
    { method: 'POST', path: '/api/customers/deletecustomer', config: { handler: customer.deleteCustomer } },
    { method: 'POST', path: '/api/customers/savecustomerphone', config: { handler: customer.saveCustomerPhone } },
    { method: 'POST', path: '/api/customers/updatecustomerphone', config: { handler: customer.updateCustomerPhone } },
    { method: 'POST', path: '/api/customers/deletecustomerphone', config: { handler: customer.deleteCustomerPhone } }
];