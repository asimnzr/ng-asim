'use strict';

module.exports = function (sequelize, DataTypes) {

    const Customer = sequelize.import('./customer.js');
    const Employee = sequelize.import('./employee.js');
    const Status = sequelize.import('./status.js');
    const Device = sequelize.import('./device.js');
    const Location = sequelize.import('./location.js');
    const ReceiveDevice = sequelize.import('./receivedevice.js');

    const ReceiveDeviceHistory = sequelize.define(
        'ReceiveDeviceHistory', {
            stickerNo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            serialNo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            formNo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            receiveDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            handoverDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            deliverStatus: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            approvedTotal: {
                type: DataTypes.INTEGER,
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
    ReceiveDeviceHistory.belongsTo(ReceiveDevice);
    ReceiveDeviceHistory.belongsTo(Customer);
    ReceiveDeviceHistory.belongsTo(Device);
    ReceiveDeviceHistory.belongsTo(Location);
    ReceiveDeviceHistory.belongsTo(Status, { as: 'SoftwareStatus' });
    ReceiveDeviceHistory.belongsTo(Status, { as: 'HardwareStatus' });
    ReceiveDeviceHistory.belongsTo(Employee, { as: 'SoftwareEmployee' });
    ReceiveDeviceHistory.belongsTo(Employee, { as: 'HardwareEmployee' });
    return ReceiveDeviceHistory;
}