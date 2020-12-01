const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('futbol', 'lucas', 'asd', {
  host: 'localhost',
  dialect: 'postgres'
})
const notNull = false

module.exports = {
  equipos: sequelize.define('equipos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    nombre: {
      type: DataTypes.STRING,
      notNull,
    }
  }),
  jugadores: sequelize.define('jugadores', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    nombre: {
      type: DataTypes.STRING,
      notNull,
    },
    posicion: {
      type: DataTypes.INTEGER,
      notNull,
    },
    equipo: {
      type: DataTypes.INTEGER,
      notNull,
    },
  }),
  partidos: sequelize.define('partidos', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    fecha: {
      type: DataTypes.DATE,
      notNull,
    },
    local_equipo: {
      type: DataTypes.INTEGER,
      notNull,
    },
    visit_equipo: {
      type: DataTypes.INTEGER,
      notNull,
    },
    local_goles: {
      type: DataTypes.INTEGER,
      notNull,
    },
    visit_goles: {
      type: DataTypes.INTEGER,
      notNull,
    },
  })
}
