const express = require('express');
const http = require('http');
const app = express()
const port = 3000
const sqlQuery = require('./mysql')

app.get('/banner', async (req, res) => {
  const strSql = `select * from student_table where name like '%${req.query.searchKey}%'`;
  const result = await sqlQuery(strSql)
  res.json(Array.from(result))
  res.send('banner')
})

const server = http.createServer(app)
server.listen(port)
server.on('error', (err) => {
  console.error(err)
})
server.on('listening', () => {
  console.log(`Listening on ${port}`)
})