const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('server', 'server', 'chat', {
  host: 'localhost',
  dialect: 'postgres'
})
module.exports = exports = sequelize.define('friends', {
  user1: {
    type: DataTypes.STRING,
    primaryKey: true,
    notNull: false,
    field: 'user_1',
  },
  user2: {
    type: DataTypes.STRING,
    primaryKey: true,
    notNull: false,
    field: 'user_2',
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
