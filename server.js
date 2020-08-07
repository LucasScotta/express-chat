// Si tu codigo hace require debe estar declarado como dependencia en el package.json
const PORT = 8080
// const path = require('path')

const app = require('./app')


app.listen(PORT)
console.log('listen on localhost:' + PORT)
