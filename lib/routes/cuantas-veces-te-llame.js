// Llamada global sin importar el usuario

let result = -1
module.exports = (req, resp) => resp.json(`Fui llamado ${result += 1} ${result === 1 ? 'vez' : 'veces'}`)