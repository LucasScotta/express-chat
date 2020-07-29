module.exports = (req, resp) => {
	delete req.sesion.user
	delete req.sesion.time
	resp.redirect('/')
}