'use strict';

module.exports = function (sequelize, DataTypes) {
    var Accessory = sequelize.define(
        'Accessory',
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
    return Accessory;
}