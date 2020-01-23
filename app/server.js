const NET = require('net')
const CANVAS = require('./canvas')

/** Class creates a server on a port */
class Server {
  /**
  * Create a server.
  * @param {number} port - The port value.
  */
  constructor (port) {
    this.port = port || 8124 // no port is passed, default to 8124
  }

  /**
  * Starts a telnet server on port and starts listening for connections.
  */
  start () {
    const serv = NET.createServer(client => {
      console.log('client connected from', client.remoteAddress)
      client.write('hello\r\n') // say hello to client

      // create a new canvas for this client
      let canvas = new CANVAS(client)

      // once the client has exited, do any clean necessary
      client.on('end', () => {
        console.log('client', client.remoteAddress, 'disconnected')
        canvas = undefined
      })
    })

    // bad thing happen, throw error
    serv.on('error', (err) => {
      throw err
    })

    // turn on server and listen on specificed port
    serv.listen(this.port, () => {
      console.log('server bound and listening on', this.port)
    })
  }
}

module.exports = function (port) {
  return new Server(port)
}
