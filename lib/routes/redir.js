module.exports = (req, resp, echo) => {
  const path = req.cookies.path
  if(path && path !== '/undefined') {
    return void echo(null, path)
  }
  else {
    return void echo(path)
  }
}
