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
    // 查询是否有对应手机号用户
    const sqlStr = `select userPhone from user where userPhone=${userPhone}`;
    const result = await sqlQuery(sqlStr);
    if (result.length) {
      // 如果手机号对，则更新其名称
      const userInfo = `select nickName,password from user where userPhone=${userPhone}`;
      const userInfoRes = await sqlQuery(userInfo);
      if (userInfoRes.length && userInfoRes[0].password === password) {
        if (nickName !== userInfoRes[0]['nickName']) {
          // 如果名称跟表中的不同，则更新
          const updateSql = `update user set nickName='${nickName}' where userPhone=${userPhone}`
          await sqlQuery(updateSql)
        }
        // if (clientType === "h5") {
        //   // 用户名存入session
        //   req.session.nickName = userInfo.nickName
        // }
        
        res.send({
          code: 1,
          mes: "登录成功",
          result: {
            userPhone,
            nickName
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

// const H5Login = ({req, userInfo}) => {
//   req.session.nickName = userInfo.nickName
// }

module.exports = router;
