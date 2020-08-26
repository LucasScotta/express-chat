module.exports = {
  isConnected: (req) => Boolean(req.sesion.waiting),
  disconnect: (client) => {
    delete client.req.sesion.user
    delete client.req.sesion.time
    delete client.req.sesion.waiting
  }
}
