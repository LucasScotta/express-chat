module.exports = (req, resp) => {
  const view = req.sesion.user
    ? './chat/index'
    : './loggin/index'
  const user = req.sesion.user
    ? req.sesion.user.name
    : null
  resp.render(view, { user }, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
}
