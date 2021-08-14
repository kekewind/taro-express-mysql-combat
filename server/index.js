const express = require('express');
const http = require('http');
const app = express()
const bodyParser = require('body-parser')
const models = require('./models')

// 中间件：post请求时的请求体解析{ name: 'wang', password: '123456' }
app.use(bodyParser.json())

models(app)
// 创建服务
const server = http.createServer(app)
const port = 3000
server.listen(port)
server.on('error', (err) => {
  console.error(err)
})
server.on('listening', () => {
  console.log(`Listening on ${port}`)
})