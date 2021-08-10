const express = require('express')
const router = express.Router()
const sqlQuery = require('../mysql')

router.get('/advertising', async (req, res) => {
  const strSql = `select * from advertising`;
  const result = await sqlQuery(strSql)
  res.send({
    code: 1,
    mes: '请求成功',
    result,
  })
})

module.exports = router