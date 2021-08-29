const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");
// const loginMidWare = require("../middleware/isLogin");

router.post("/login", async (req, res) => {
  // req.session.username = "yb"
  try {
    console.log("--req--", req.body);
    const { userPhone, password, nickName } = req.body;
    const createTableSql = `
    create table if not exists user (
      id int auto_increment,
      userPhone char(11) not null,
      password char(10) not null,
      nickName char(50) not null,
      primary key (id)
    ) engine=innodb;
  `;
    await sqlQuery(createTableSql);
    // 查询是否有手机号
    const sqlStr = `select userPhone from user where userPhone=${userPhone}`;
    const result = await sqlQuery(sqlStr);
    console.log("res--->", result);
    if (result.length) {
      const passwordStr = `select nickName,password from user where userPhone=${userPhone}`;
      const pwRes = await sqlQuery(passwordStr);
      console.log("--pwRes--", pwRes);
      if (pwRes.length && pwRes[0].password === password) {
        res.send({
          code: 1,
          mes: "登录成功",
          result: {
            userPhone,
            nickName: pwRes[0].nickName
          }
        });
      } else {
        res.send({
          code: 2,
          mes: "密码错误",
        });
      }
    } else {
      const insertSql = `insert into user(id, nickName, userPhone, password) values(null, '${nickName}', '${userPhone}', '${password}')`;
      await sqlQuery(insertSql);
      res.send({
        code: 1,
        mes: "创建用户并登录成功",
        result: {
          userPhone,
          nickName: nickName
        }
      });
    }
  } catch(err) {
    res.send({
      code: -1,
      mes: "请求失败",
      result: err
    });
  }
});

router.get("/exitLogin", (req, res) => {
  req.session.destroy(() => {
    console.log("销毁session");
  });
  res.send("成功退出登录");
});
module.exports = router;
