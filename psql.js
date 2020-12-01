module.exports = () => {

  const futbol = require('./futbol')
  const libreria = require('./libreria')
  futbol.equipos
    .findAll({
      attributes: ['id'],
      where: {
        nombre: ['Deportivo La Tristeza']
      }
    })
    .then(results => {
      const ids = []
      for (const result of results) {
        ids.push(result.dataValues.id)
      }
      futbol.jugadores
        .findAll({
          attributes: ['nombre', 'equipo'],
          where: {
            equipo: ids
          }
        })
        .then(results => {
          for (const result of results) {
            console.log(result.dataValues.equipo + " | " + result.dataValues.nombre)
          }
        })
      })
  const ivan = {
    nombre: 'Ivan Nazario',
    libros: []
  }
  const alex = {
    nombre: 'Alexander Sauceda',
    libros: []
  }
  libreria.autores
    .findAll({
      attributes: ['id', 'nombre'],
      where: {
        nombre: [ivan.nombre, alex.nombre]
      }
    })
    .then(results => {
      for (const result of results) {
        const nombre = result.dataValues.nombre
        const id = result.dataValues.id
        if(nombre === ivan.nombre) ivan.id = id
        else alex.id = id
      }
    libreria.autores_libros
      .findAll({
        attributes: ['libro', 'autor'],
        where: {
          autor: [ivan.id, alex.id]
        }
      })
      .then(results => {
        for (const result of results) {
          const libro = result.dataValues.libro
          const autor = result.dataValues.autor
          libreria.libros
            .findAll({
              attributes: ['nombre'],
              where: {
                id: [libro]
              }
            })
            .then(results => {
              for (const result of results) {
                const libro = result.dataValues.nombre
                if (autor === alex.id) {
                  alex.libros.push(libro)
                }
                else ivan.libros.push(libro)
              }
            })
        }
      })
    })


  setTimeout(() => {
    console.log(ivan)
    console.log('-----------')
    console.log(alex)
  }, 3000)
}
