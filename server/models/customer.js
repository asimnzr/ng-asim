'use strict';

module.exports = function (sequelize, DataTypes) {
    var CustomerPhone = sequelize.define(
        'CustomerPhone', {
            type: {
                type: DataTypes.STRING,
                allowNull: true
            },
            number: {
                type: DataTypes.STRING,
                allowNull: true
            },
            smsEnabled: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }            
        }
    );
    var Customer = sequelize.define(
        'Customer',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                // validate: {
                //     isEmail: true
                // }
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true
            },
            // phones: {
            //     type: DataTypes.JSONB,
            //     allowNull: true
            // },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }
    );
    Customer.hasMany(CustomerPhone, { as: 'phones' })
    return Customer;
}