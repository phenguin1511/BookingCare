'use strict';
const {
  Model,
  BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
      User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
      User.hasOne(models.Doctor_Infor, { foreignKey: 'doctorId' });
      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });
      User.hasMany(models.Booking, { foreignKey: 'patientId', as: 'patientData' });
      User.hasMany(models.Booking, { foreignKey: 'doctorId', as: 'doctorDataBooking' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    resetToken: DataTypes.STRING,           // New field for the reset token
    resetTokenExpiry: DataTypes.DATE        // New field for the token expiry time
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
