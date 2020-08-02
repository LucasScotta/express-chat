module.exports = (req, resp) => {
  delete req.sesion.user
  delete req.sesion.time
  resp.status(200)
  return resp.send('Unlogged correctly')
}
