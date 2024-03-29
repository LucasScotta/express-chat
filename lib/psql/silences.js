const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('server', 'server', 'chat', {
  host: 'localhost',
  dialect: 'postgres'
})
module.exports = exports = sequelize.define('silences', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    notNull: false,
  },
  silence: {
    type: DataTypes.STRING,
    primaryKey: true,
    notNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
})
