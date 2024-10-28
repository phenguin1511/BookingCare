'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Nguyen',
        lastName: 'Phuc',
        email: 'admin@gmail.com',
        password: '123456',
        address: 'Bien Hoa',
        gender: 1,
        roleId: 'R1',
        phonenumber: '0337326045',
        image: 'Hello',



        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
