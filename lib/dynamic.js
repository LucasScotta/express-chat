const path = require('path')

module.exports = (dir) => (req, resp, next) => {
	let result
	try {
		result = require(`${process.cwd()}/${dir}/${req.params.path}`)()
	}
	catch(err) {
		return next()
	}
	resp.type(path.extname(req.params.path))
	resp.send(result)
}