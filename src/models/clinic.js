'use strict';
const {
    Model,
    BOOLEAN,
    DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {

        static associate(models) {
            Clinic.hasMany(models.Doctor_Infor, { foreignKey: 'clinicId', as: 'clinicTypeData' });
        }
    }
    Clinic.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        descriptionMarkdown: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};