'use strict';

module.exports = function(sequelize, DataTypes) {

    const Customer = sequelize.import('./customer.js');
    const Employee = sequelize.import('./employee.js');
    const Status = sequelize.import('./status.js');
    const Device = sequelize.import('./device.js');
    const Location = sequelize.import('./location.js');
    const DeviceProblem = sequelize.import('./deviceproblem.js');
    const Accessory = sequelize.import('./accessory.js');
    const MissingDevice = sequelize.import('./missingdevice.js');

    const ReceiveDeviceProblem = sequelize.define(
        'ReceiveDeviceProblem', {
            detail: {
                type: DataTypes.STRING,
                allowNull: true
            },
            cost: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            serviceCharges: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }
    );
    const ReceiveDeviceEmployeeProblem = sequelize.define(
        'ReceiveDeviceEmployeeProblem', {
            detail: {
                type: DataTypes.STRING,
                allowNull: true
            },
            cost: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            serviceCharges: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }
    );
    ReceiveDeviceProblem.belongsTo(DeviceProblem);
    ReceiveDeviceEmployeeProblem.belongsTo(DeviceProblem);

    const ReceiveDeviceCommunication = sequelize.define(
        'ReceiveDeviceCommunication', {
            phoneNo: {
                type: DataTypes.STRING,
                allowNull: true
            },
            communicationDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            communcationTime: {
                type: DataTypes.DATE,
                allowNull: true
            },
            details: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }
    );

    const ReceiveDeviceAccessory = sequelize.define(
        'ReceiveDeviceAccessory', {}
    );
    ReceiveDeviceAccessory.belongsTo(Accessory);

    const ReceiveDeviceMissingDevice = sequelize.define(
        'ReceiveDeviceMissingDevice', {}
    );
    ReceiveDeviceMissingDevice.belongsTo(MissingDevice);

    const ReceiveDevice = sequelize.define(
        'ReceiveDevice', {
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
    ReceiveDevice.belongsTo(Customer);
    ReceiveDevice.belongsTo(Device);
    ReceiveDevice.belongsTo(Location);
    ReceiveDevice.belongsTo(Status, { as: 'SoftwareStatus' });
    ReceiveDevice.belongsTo(Status, { as: 'HardwareStatus' });
    ReceiveDevice.belongsTo(Employee, { as: 'SoftwareEmployee' });
    ReceiveDevice.belongsTo(Employee, { as: 'HardwareEmployee' });
    ReceiveDevice.hasMany(ReceiveDeviceProblem, { as: 'ReceiveDeviceProblems' });
    ReceiveDevice.hasMany(ReceiveDeviceEmployeeProblem, { as: 'ReceiveDeviceEmployeeProblems' });
    ReceiveDevice.hasMany(ReceiveDeviceCommunication, { as: 'ReceiveDeviceCommunications' });
    ReceiveDevice.hasMany(ReceiveDeviceAccessory, { as: 'ReceiveDeviceAccessories' });
    ReceiveDevice.hasMany(ReceiveDeviceMissingDevice, { as: 'ReceiveDeviceMissingDevices' });
    return ReceiveDevice;
}