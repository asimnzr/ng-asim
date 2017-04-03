'use strict';

module.exports = function (sequelize, DataTypes) {
    var DeviceType = sequelize.define(
        'DeviceType',
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
    return DeviceType;
}