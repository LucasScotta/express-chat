const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('server', 'server', 'chat', {
  host: 'localhost',
  dialect: 'postgres'
})
module.exports = exports = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    notNull: false,
  },
  pass: {
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
