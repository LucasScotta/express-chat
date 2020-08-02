module.exports = (req, resp, callback) => {
  console.log(req.cookies.path)
  if(req.cookies.path && req.cookies.path !== '/undefined') {
    callback(null, req.cookies.path)
  }
  else {
    callback(req.cookies.path)
  }
}
