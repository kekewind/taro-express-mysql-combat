const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");

router.post("/order", async (req, res) => {
  try {
    const { userPhone, orderInfo } = req.body;
    const {
      dptCityName,
      arrCityName,
      dptTimeStr,
      dptTime,
      price
    } = orderInfo
    const createTableSql = `
    create table if not exists orderList (
      id int auto_increment,
      userPhone char(11) not null,
      dptCityName char(50) not null,
      arrCityName char(50) not null,
      dptTimeStr char(50) not null,
      dptTime char(50) not null,
      price decimal not null,
      primary key (id)
    ) engine=innodb;
  `;
    await sqlQuery(createTableSql);
    const insertSql = `insert into orderList(id, userPhone, dptCityName, arrCityName, dptTimeStr, dptTime, price) values(null, '${userPhone}', '${dptCityName}', '${arrCityName}', '${dptTimeStr}', '${dptTime}', '${price}')`;
    await sqlQuery(insertSql)
    res.send({
      code: 1,
      mes: "预定成功~",
    });
  } catch(err) {
    res.send({
      code: -1,
      mes: "请求失败",
      result: err
    });
  }
})

// TODO: 使用联结查询
router.post('/getOrderList', async (req, res) => {
  try {
    const { userPhone } = req.body
    // asc:升序 desc:降序
    const querySql = `select * from orderList where userPhone=${userPhone} order by id desc`
    const result = await sqlQuery(querySql)
    res.send({
      code: 1,
      mes: "查询成功",
      result
    });
  } catch(err) {
    res.send({
      code: -1,
      mes: "请求失败",
      result: err
    });
  }
  

})

module.exports = router;


