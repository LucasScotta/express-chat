// Devuelve la cantidad de veces que el cliente llamo a esta ruta


module.exports = function(req, resp) {
  const result = req.sesion.call || 0
  req.sesion.call = result + 1
  resp.json(`Me llamaste ${result} ${result === 1 ? 'vez' : 'veces'}`)
}