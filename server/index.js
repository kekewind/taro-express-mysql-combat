const express = require('express');
const http = require('http');
const app = express()
const port = 3000
const models = require('./models')

models(app)

const server = http.createServer(app)
server.listen(port)
server.on('error', (err) => {
  console.error(err)
})
server.on('listening', () => {
  console.log(`Listening on ${port}`)
})