'use strict';

module.exports = function (sequelize, DataTypes) {
    var Location = sequelize.define(
        'Location',
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
    return Location;
}