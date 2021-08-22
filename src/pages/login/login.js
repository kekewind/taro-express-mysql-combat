import { PureComponent } from "react";
import { View } from "@tarojs/components";
// import Taro from '@tarojs/taro';
// import { loginReq } from '@/common/api'
// import user from '@/common/user';

import './login.scss';

export default class Login extends PureComponent {
  componentDidMount() {
    // Taro.login()
    //   .then((res) => {
    //     console.log(res)
    //     const { code } = res
    //     loginReq({
    //       js_code: code,
    //       appid: user.appId,
    //       secret: user.appSecret,
    //       grant_type: 'authorization_code'
    //     })
    //   })
  }
  render() {
    return (
      <View className="login-container">
        登陆页
      </View>
    )
  }
}