'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('elevator_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      elevatorId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      currentFloor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      direction: {
        type: Sequelize.ENUM('up', 'down', 'idle'),
        allowNull: false
      },
      doorState: {
        type: Sequelize.ENUM('open', 'closed'),
        allowNull: false
      },
      requestedFloor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      targetFloor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('elevator_logs');
  }
};