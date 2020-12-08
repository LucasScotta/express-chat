const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('server', 'server', 'chat', {
  host: 'localhost',
  dialect: 'postgres'
})
module.exports = exports = sequelize.define('usuarios', {
  serial: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    notNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    notNull: false,
  },
  password: {
    type: DataTypes.STRING,
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
