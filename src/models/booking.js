'use strict';
const {
    Model,
    BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {

        static associate(models) {

        }
    }
    Booking.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        token: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Booking',
        freezeTableName: true
    });
    return Booking;
};