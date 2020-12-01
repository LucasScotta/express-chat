const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('libreria', 'lucas', 'asd', {
  host: 'localhost',
  dialect: 'postgres'
})
const notNull = false

module.exports = {
  autores: sequelize.define('autores', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    nombre: {
      type: DataTypes.STRING,
      notNull,
    },
    edad: {
      type: DataTypes.INTEGER,
      notNull,
    }
  }),
  editoriales: sequelize.define('editoriales', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    nombre: {
      type: DataTypes.STRING,
      notNull,
    },
  }),
  libros: sequelize.define('libros', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    tipo: {
      type: DataTypes.INTEGER,
      notNull,
    },
    nombre: {
      type: DataTypes.STRING,
      notNull,
    },
    publicado: {
      type: DataTypes.BOOLEAN,
      notNull,
    },
    editorial: {
      type: DataTypes.INTEGER,
      notNull,
    },
  }),
  tipo_libros: sequelize.define('tipo_libros', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    nombre: {
      type: DataTypes.STRING,
      notNull,
    },
  }),
  autores_libros: sequelize.define('autores_libros', {
    libro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
    autor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull,
    },
  }),
}
