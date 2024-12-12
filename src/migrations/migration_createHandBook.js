'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('handbooks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER // Đảm bảo kiểu dữ liệu là INTEGER
            },
            title: {
                type: Sequelize.STRING,
            },
            child_title: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT,
            },
            descriptionHTML: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.BLOB('long')
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('handbooks');
    }
};
