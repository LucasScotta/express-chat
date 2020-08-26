const Feed = require('./feed')
/*
1 Permitir que usuarios entren a la sala
2 Listar usuario conectados a la sala
3 Permitir que usuarios salgan de la sala





Dar Vader => luke
Dar Vader => Leia
const Vader = {
  hijos: [luke, leia]
}

luke => Dar Vader
const luke = {
  padre: Vader
}


Permitir que los usuarios envien mensajes
Asignar un moderador de sala
*/
let ID = 0
module.exports = class Room {
  constructor() {
    this.id = ID += 1
  }
  getId() {
    return this.id
  }
}
