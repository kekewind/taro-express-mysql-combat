const express = require('express');
const http = require('http');
const app = express()
// const bodyParser = require('body-parser')
const models = require('./models')
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(session({
  secret: "lsfdjlsjfljdgk",
  resave: true, // 强制保存session
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 设置session的有效期为1周
  },
  saveUninitialized: true // 是否保存初始化的session
}))
app.use(express.json());
// 中间件：post请求时的请求体解析{ name: 'wang', password: '123456' }
app.use(express.urlencoded({
  extended: false,
}))
app.use(cookieParser('secret'))

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