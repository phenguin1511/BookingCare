'use strict';
const {
    Model,
    BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {

        static associate(models) {
            Allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
            Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
            Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })
            Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })
            Allcode.hasMany(models.Booking, { foreignKey: 'date', as: 'dateTypeDataPatient' })
            Allcode.hasMany(models.Booking, { foreignKey: 'statusId', as: 'statusTypeDataPatient' })
            Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'priceId', as: 'priceTypeData' })
            Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })
            Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'provinceId', as: 'provinceTypeData' })
        }
    }
    Allcode.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVn: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Allcode',
    });
    return Allcode;
};