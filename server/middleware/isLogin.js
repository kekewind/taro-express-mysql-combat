const isLogin = (req, res, next) => {
  if (!req.session.phoneNumber) {
    res.send("未登录")
  } else {
    res.next()
  }
}

module.exports = isLogin