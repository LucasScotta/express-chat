module.exports = (req, resp) => {
  const user = req.sesion.user ? req.sesion.user.name : null
  resp.render('./loggin/index', { user }, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
}
