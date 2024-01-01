const express = require('express');
const server = express();
const { log } = require("../functions");

server.all('/', (req, res) => {
  res.send(`Result: [OK].`)
});

function keepAlive() {
  server.listen(3000, () => {
    log(`Die Bot Website ist nun Online.`, "done");
  });
}

module.exports = keepAlive;