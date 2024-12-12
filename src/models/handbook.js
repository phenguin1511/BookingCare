'use strict';
const {
    Model,
    BOOLEAN,
    DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HandBook extends Model {

        static associate(models) {

        }
    }
    HandBook.init({
        title: DataTypes.STRING,
        address: DataTypes.STRING,
        child_title: DataTypes.STRING,
        descriptionMarkdown: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'HandBook',
    });
    return HandBook;
};