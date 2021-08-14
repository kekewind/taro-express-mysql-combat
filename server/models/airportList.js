const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");
const request = require('request')

// 创建机场城市列表
// request('https://m.ctrip.com/restapi/soa2/17420/json/FlightAirportList', { json: true }, async (err, res, body) => {
//   // console.log('res', body.data)
//   const strSql1 =
//   `
//     create table airport_list(
//       id int not null auto_increment,
//       cityName char(50) not null,
//       cityId int not null,
//       firstLetter char(50) not null,
//       primary key (id)
//     ) engine=innodb;
//   `
//   await sqlQuery(`drop table if exists airport_list`)
//   await sqlQuery(strSql1)
//   for (let i = 0; i < body.data.length; i++) {
//     const { id, cityId, cityName, firstLetter } = body.data[i]
//     const strSql2 = `insert into airport_list(id, cityName, cityId, firstLetter) values(${id}, '${cityName}', ${cityId}, '${firstLetter}');`
//     await sqlQuery(strSql2)
//   }
//   console.log('创建表成功')
// })

router.get("/airportList", async (req, res) => {
  const strSql = `select * from airport_list`;
  const result = await sqlQuery(strSql);
  // 按照首字母排序
  if (Array.isArray(result) && result.length) {
    // sort方法是按照字符串的ASCII码值进行排序的
    result.sort((x, y) => {
      if (x.firstLetter < y.firstLetter)  {
        return -1;
      } else if (x.firstLetter > y.firstLetter) {
        return 1;
      }
      return 0;
    })
  }
  res.send({
    code: 1,
    mes: "请求成功",
    result,
  });
});

module.exports = router;