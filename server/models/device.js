'use strict';

module.exports = function(sequelize, DataTypes) {
    const DeviceType = sequelize.import('./devicetype.js');

    var Device = sequelize.define(
        'Device',
        {
            brand: {
                type: DataTypes.STRING,
                allowNull: false
            },
            series: {
                type: DataTypes.STRING,
                allowNull: false
            },
            model: {
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
    Device.belongsTo(DeviceType);
    return Device;
}