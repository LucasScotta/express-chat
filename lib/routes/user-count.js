module.exports = (req, resp) => {
  const result = req.user.call || 0
  req.user.call = result + 1
  resp.json(`Me llamaste ${result} ${result === 1 ? 'vez' : 'veces'}`)
}