const sessionID = require('./session-id')
const sesions = new Map()

module.exports = (req, resp, next) => {
	/*
	if(Si no tengo sid) creo una para esta sesion, 
	*/
	if(!req.cookies.sid) {
		req.cookies.sid = sessionID(32)
		resp.cookie('sid', req.cookies.sid, {domain: req.hostname})
	}
	/*
	Validar la clave sid dentro de sesions si no la tengo la creo y sino sigo adelante
	*/
	if (sesions.has(req.cookies.sid)) {
		req.sesion = sesions.get(req.cookies.sid)
	}
	else {
		const sesion = {}
		sesions.set(req.cookies.sid, sesion)
		req.sesion = sesion
	}
	next()
}