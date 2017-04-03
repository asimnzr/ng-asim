'use strict';

module.exports = function (sequelize, DataTypes) {
    var ProblemType = sequelize.define(
        'ProblemType',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
        );
    var DeviceProblem = sequelize.define(
        'DeviceProblem',
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
    DeviceProblem.belongsTo(ProblemType);
    return DeviceProblem;
}