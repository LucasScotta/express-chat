module.exports = (req, resp) => {
    if (typeof req.body.number === 'number') {
      return resp.send(200, {number: req.body.number + 1})
    }
    return resp.sendStatus(417)
  }
