'use strict';

module.exports = function (sequelize, DataTypes) {
    var Status = sequelize.define(
        'Status',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
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
    return Status;
}