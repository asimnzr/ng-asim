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
    const customer = db.sequelize.models.Customer;
    customer.findAll({ include: { model: db.sequelize.models.CustomerPhone, as: 'phones' } })
        .then(function (customers) {
            return reply(customers);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.searchCustomers = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const query = request.query.searchText;
    customer.findAll({ include: { model: db.sequelize.models.CustomerPhone, as: 'phones' }, where: { name: { $iLike: '%' + query + '%' } } })
        .then(function (customers) {
            return reply(customers);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getCount = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const query = request.query.searchText;
    customer.findAll({
        where: buildWhereClause(query),
        attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'customersCount']]
    })
        .then(function (counts) {
            var count = +counts[0].dataValues.customersCount;
            return reply(count);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getPage = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const query = request.payload.searchText;
    const pageSize = request.payload.pageSize;
    const pageNo = request.payload.pageNo;
    console.log(pageSize * pageNo);
    customer.findAll({
        where: buildWhereClause(query),
        limit: pageSize,
        offset: pageSize * pageNo
    })
        .then(function (customers) {
            return reply(customers);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.getCustomerById = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const customerId = request.query.customerId;

    customer.findOne({ include: { model: db.sequelize.models.CustomerPhone, as: 'phones' }, where: { id: customerId } })
        .then(function (customers) {
            return reply(customers);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveCustomer = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const customerPhone = db.sequelize.models.CustomerPhone;
    const customerToSave = request.payload.customer;
    if (customerToSave) {
        customerToSave.createdBy = request.auth.credentials.id;
    }
    customer.create(customerToSave)
        .then(function (customer) {
            var customerPhones = [];

            // save phones, if any
            if (customerToSave.phones) {
                customerToSave.phones.forEach(function (phone, index) {
                    phone.CustomerId = customer.id;
                    customerPhones.push(phone);
                });
                customerPhone.bulkCreate(customerPhones).then(function () { });
            }
            return reply(customer.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateCustomer = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const customerToSave = request.payload.customer;
    if (customerToSave) {
        customerToSave.updatedBy = request.auth.credentials.id;
    }
    customer.update(customerToSave, { where: { id: customerToSave.id } })
        .then(function (customer) {
            return reply('Customer updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteCustomer = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    const customerId = request.payload.customerId;

    customer.destroy({ where: { id: customerId } })
        .then(function (customer) {
            return reply('Customer deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.saveCustomerPhone = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customerPhone = db.sequelize.models.CustomerPhone;
    const customerPhoneToSave = request.payload.customerPhone;
    customerPhone.create(customerPhoneToSave)
        .then(function (savedCustomerPhone) {
            return reply(savedCustomerPhone.id);
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.updateCustomerPhone = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customerPhone = db.sequelize.models.CustomerPhone;
    const customerPhoneToSave = request.payload.customerPhone;
    if (customerPhoneToSave) {
        customerPhoneToSave.updatedBy = request.auth.credentials.id;
    }
    customerPhone.update(customerPhoneToSave, { where: { id: customerPhoneToSave.id } })
        .then(function (customerPhone) {
            return reply('Customer phone updated successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.deleteCustomerPhone = function (request, reply) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customerPhone = db.sequelize.models.CustomerPhone;
    const customerPhoneId = request.payload.customerPhoneId;

    customerPhone.destroy({ where: { id: customerPhoneId } })
        .then(function (customer) {
            return reply('Customer phone deleted successfully!');
        })
        .catch(function (err) {
            return reply(Boom.badData(err));
        });
};

exports.test = function (request) {
    const db = request.server.plugins['hapi-sequelize'].db
    const customer = db.sequelize.models.Customer;
    customer.sync().then(function () {
    });
    customer.create({
        name: 'Akbar Ali',
        email: 'akbarali.2006@gmail.com',
        address: '313-Q Block Model Town Lahore',
        phones: [{ "type": "Mobile", "number": "00923334184716", "smsEnabled": true },
        { "type": "Land Line", "number": "00924235444807" },
        { "type": "Fax", "number": "00924235858982" }
        ]
    }).then(function (cust) {
        return cust;
    }).catch(function (err) {
        console.log('Error occured' + err);
    });
};
