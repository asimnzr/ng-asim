'use strict';

module.exports = function (sequelize, DataTypes) {
    var MissingDevice = sequelize.define(
        'MissingDevice',
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
    return MissingDevice;
}