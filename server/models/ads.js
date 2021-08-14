const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");
const request = require('request')

router.get("/advertising", async (req, res) => {
  const strSql = `select * from advertising`;
  const result = await sqlQuery(strSql);
  res.send({
    code: 1,
    message: "请求成功",
    result,
  });
});

module.exports = router;
