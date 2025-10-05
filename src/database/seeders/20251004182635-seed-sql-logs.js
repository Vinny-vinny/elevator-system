'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('sql_logs', [
          {
              query: "INSERT INTO elevator_logs (elevatorId, currentFloor) VALUES (1, 1)",
              action: "INSERT",
              endpoint: "/api/elevator/call",
              metadata: JSON.stringify({ elevatorId: 1 }),
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ]);
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('sql_logs', null, {});
  }
};
