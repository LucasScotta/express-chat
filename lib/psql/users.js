const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('server', 'server', 'chat', {
  host: 'localhost',
  dialect: 'postgres'
})
const users = sequelize.define('usuarios', {
  usuario: {
    type: DataTypes.STRING,
    primaryKey: true,
    notNull: false,
  },
  password: {
    type: DataTypes.STRING,
    notNull: false,
  },
  blockeds: {
    type: DataTypes.STRING,
  },
  silenced: {
    type: DataTypes.STRING,
  },
  friends: {
    type: DataTypes.STRING,
  },
  friendvequests: {
    type: DataTypes.STRING,
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

module.exports = users
