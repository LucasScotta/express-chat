module.exports = (req, resp) => {
    if (req.sesion.user) {
      resp.send({ user: req.sesion.user.name })
    }
    else resp.sendStatus(200)
  }
