'use strict';

module.exports = function (sequelize, DataTypes) {
    var Employee = sequelize.define(
        'Employee',
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
            type: {
                type: DataTypes.STRING,
                allowNull: true
            },
            imagePath:
            {
                type: DataTypes.STRING,
                allowNull: true
            },
            phones: {
                type: DataTypes.JSONB,
                allowNull: true
            },
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
    return Employee;
}