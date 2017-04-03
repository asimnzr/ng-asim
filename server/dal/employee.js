'use strict';
const Boom = require('boom');

function buildWhereClause(query) {
    var whereClause;

    if (query) {
        whereClause = { name: query };
    }
    return whereClause;
}

exports.getAll = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    employee.findAll()
        .then(function (employees) {
            return reply(employees);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.searchEmployees = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const query = request.payload.searchText;
    const type = request.payload.type;
    var where = {
        name: { $iLike: '%' + query + '%' },
    };
    if (type !== 'both') {
        where.type = type;
    }
    employee.findAll({ where: where })
        .then(function (employees) {
            return reply(employees);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getCount = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const query = request.query.searchText;
    employee.findAll({
        where: buildWhereClause(query),
        attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'employeesCount']]
    })
        .then(function (counts) {
            var count = +counts[0].dataValues.employeesCount;
            return reply(count);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getPage = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const query = request.payload.searchText;
    const pageSize = request.payload.pageSize;
    const pageNo = request.payload.pageNo;
    employee.findAll({
        where: buildWhereClause(query),
        limit: pageSize,
        offset: pageSize * pageNo
    })
        .then(function (employees) {
            return reply(employees);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getEmployeeById = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const employeeId = request.query.employeeId;

    employee.findOne({ where: { id: employeeId } })
        .then(function (employees) {
            return reply(employees);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveEmployee = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const employeeToSave = request.payload.employee;
    if (employeeToSave) {
        employeeToSave.createdBy = request.auth.credentials.id;
    }
    employee.create(employeeToSave)
        .then(function (employee) {
            return reply(employee.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateEmployee = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const employeeToSave = request.payload.employee;
    if (employeeToSave) {
        employeeToSave.updatedBy = request.auth.credentials.id;
    }
    employee.update(employeeToSave, { where: { id: employeeToSave.id } })
        .then(function (employee) {
            return reply('Employee updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteEmployee = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    const employeeId = request.payload.employeeId;

    employee.destroy({ where: { id: employeeId } })
        .then(function (employee) {
            return reply('Employee deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const employee = db.sequelize.models.Employee;
    employee.sync().then(function () {
        employee.create({
            name: 'Akbar Ali',
            email: 'akbarali.2006@gmail.com',
            address: '313-Q Block Model Town Lahore',
            phones: [{ "type": "Mobile", "number": "00923334184716", "smsEnabled": true },
                { "type": "Land Line", "number": "00924235444807" },
                { "type": "Fax", "number": "00924235858982" }
            ]
        }).then(function (emp) {
            return emp;
        }).catch(function (err) {
            console.log('Error occured' + err);
        });
    });
};
