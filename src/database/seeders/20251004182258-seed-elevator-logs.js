'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('elevator_logs', [
          {
              elevatorId: 1,
              currentFloor: 1,
              direction: 'idle',
              doorState: 'closed',
              requestedFloor: 1,
              targetFloor: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ]);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('elevator_logs', null, {});
  }
};
