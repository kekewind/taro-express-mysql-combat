const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");
const dayjs = require('dayjs')

/**
 * 得到一个两数之间的随机整数
 */
const randomPrice = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

router.get("/singleList", async (req, res) => {
  console.log('--query--', req.query)
  const {
    dptAirportName,
    dptCityName,
    arrCityName,
    arrAirportName,
    dptDate,
  } = req.query
  const strSql = `select * from flight_list`;
  try {
    const result = await sqlQuery(strSql);
    const resultList = result.map(item => ({
      ...item,
      dptAirportName,
      dptCityName,
      arrCityName,
      arrAirportName,
      dptTimeStr: dayjs(item.dptTime).format("HH:mm"),
      arrTimeStr: dayjs(item.arrTime).format("HH:mm"),
      price: randomPrice(300, 1000),
      dptTime: dptDate, // 模拟日期选择
    }))
    res.send({
      code: 1,
      message: "请求成功",
      result: resultList,
    });
  } catch(err) {
    console.error(err)
    res.send({
      code: -1,
      message: "请求失败"
    });
  }
});

module.exports = router;