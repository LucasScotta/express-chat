const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('server', 'server', 'chat', {
  host: 'localhost',
  dialect: 'postgres'
})
module.exports = exports = sequelize.define('friend_requests', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    notNull: false,
  },
  request: {
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
