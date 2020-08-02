module.exports = (req, resp, next) => {
  const url = req._parsedUrl.path
  if(url !== '/favicon.ico') {
    if(url !== '/login' && url !== '/logout' && url !== '/login/create' && !req.sesion.user && !req.cookies.path) {
     resp.cookie('path', process.env.API_ROUTE + url, {maxAge: 30000, domain: req.hostname})
   }
   return next()
 }
}
