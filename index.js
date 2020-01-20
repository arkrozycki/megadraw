// entrypoint index.js file

const PORT = process.env.PORT
const SERVER = require('./app/server')(PORT)

SERVER.start()
