const mysql = require('mysql2')

const options = {
  host: "101.132.140.113",
  // host: "127.0.0.1",
  port: '3306',
  user: 'root',
  password: '77777777',
  database: "flight"
}
// 创建数据库连接
const connection = mysql.createConnection(options)
// 建立连接
connection.connect(err => {
  if (err) {
    console.log(err)
    return
  }
  console.log('数据库连接成功')
})

const sqlQuery = (strSql) => {
  return new Promise((resolve, reject) => {
    connection.query(strSql, (err, res, fields) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

module.exports = sqlQuery
