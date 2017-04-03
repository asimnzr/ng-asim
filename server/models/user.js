'use strict';

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false
            }            
        }
    );
    return User;
}