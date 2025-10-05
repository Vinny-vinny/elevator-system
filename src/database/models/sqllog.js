'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SqlLog extends Model {}

  SqlLog.init({
    query: DataTypes.TEXT,
    action: DataTypes.STRING,
    endpoint: DataTypes.STRING,
    metadata: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'SqlLog',
    tableName: 'sql_logs'
  });
  return SqlLog;
};