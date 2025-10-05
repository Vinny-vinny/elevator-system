'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElevatorLog extends Model {}

  ElevatorLog.init({
    elevatorId: DataTypes.INTEGER,
    currentFloor: DataTypes.INTEGER,
    direction: DataTypes.ENUM(DataTypes.STRING),
    doorState: DataTypes.ENUM(DataTypes.STRING),
    requestedFloor: DataTypes.INTEGER,
    targetFloor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ElevatorLog',
    tableName: 'elevator_logs'
  });
  return ElevatorLog;
};