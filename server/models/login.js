const express = require("express");
const router = express.Router();
const axios = require("axios")
const sqlQuery = require("../mysql");


router.post("/login", async (req, res) => {
  // console.log('---req---',req.body)
  axios.get("https://api.weixin.qq.com/sns/jscode2session", {
    params: req.body
  })
    .then(res => {
      console.log('res', res.data)
    })
    .catch(err => {
      console.log('err', err)
    })
  res.send('login')
});

module.exports = router;