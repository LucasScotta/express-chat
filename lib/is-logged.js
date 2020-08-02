// 1 Se fija en la sesion si el usuario esta logeado
// 2 Si no lo esta lo redirige al login
// 3 Si esta logeado continua navegando
// const verifyPath = require('./verify-path')

module.exports = (req, resp, next) => {

  if(Date.now() < req.sesion.time + 60 * 3 * 1000 && req.sesion.user) {
    req.user = req.sesion.user
    req.sesion.time = Date.now()
    return void next()
  }
  else {
    delete req.sesion.user
  }

  resp.status(301).sendFile(__dirname + '/routes/login.html')
}
