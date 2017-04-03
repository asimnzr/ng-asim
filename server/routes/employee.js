'use strict';
const employee = require('../controllers/employee.js');

module.exports = [
    //{ method: 'GET', path: '/register', config: { auth: false, handler: authentication.register } },
    { method: 'GET', path: '/api/employees/getall', config: { handler: employee.getAll } },
    { method: 'POST', path: '/api/employees/searchemployees', config: { handler: employee.searchEmployees } },
    { method: 'GET', path: '/api/employees/test', config: { auth: false, handler: employee.test} },
    { method: 'GET', path: '/api/employees/getcount/{searchText?}', config: { handler: employee.getCount } },
    { method: 'POST', path: '/api/employees/getpage', config: { handler: employee.getPage } },
    { method: 'GET', path: '/api/employees/getemployeebyid/{employeeId?}', config: { handler: employee.getEmployeeById } },
    { method: 'POST', path: '/api/employees/saveemployee', config: { handler: employee.saveEmployee } },
    { method: 'POST', path: '/api/employees/updateemployee', config: { handler: employee.updateEmployee } },
    { method: 'POST', path: '/api/employees/deleteemployee', config: { handler: employee.deleteEmployee } }
];