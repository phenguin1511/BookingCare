'use strict';
const {
    Model,
    BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {

        static associate(models) {
            Booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' })
            Booking.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorDataBooking' })
            Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' })
            Booking.belongsTo(models.Allcode, { foreignKey: 'date', targetKey: 'keyMap', as: 'dateTypeDataPatient' })
            Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusTypeDataPatient' })
        }
    }
    Booking.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        reason: DataTypes.TEXT,
        token: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Booking',
        freezeTableName: true
    });
    return Booking;
};