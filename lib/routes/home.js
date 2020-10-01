module.exports = (req, resp) => {
  // console.log(req.sesion)
  const user = req.sesion.user ? req.sesion.user.name : null
  resp.render('./home/index', { user }, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
}
