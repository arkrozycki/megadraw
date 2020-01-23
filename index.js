// entrypoint index.js file

const PORT = parseInt(process.env.PORT)
const SERVER = require('./app/server')(PORT)

SERVER.start()


process.on('SIGINT', function () {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${used} MB`);
  process.exit(0)
});