/* eslint-disable react/no-unused-state */
import { PureComponent } from "react";
import { View, Input, Button } from "@tarojs/components";
import { debounce } from '@/common/utils'
// import Taro from '@tarojs/taro';
// import { loginReq } from '@/common/api'
// import user from '@/common/user';

import './login.scss';

export default class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: "",
      passward: "",
    }
  }
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
  onPhoneInput = debounce((e) => {
    this.setState({
      phoneNumber: e.detail.value,
    })
  }, 300)
  onPasswordInput = debounce((e) => {
    this.setState({
      passward: e.detail.value,
    })
  }, 300)

  render() {
    return (
      <View className="login-container">
        <View className="login-top">
          <View>你好，</View>
          <View>欢迎登录智行</View>
        </View>
        <View className="login-box">
          <Input type="text" className="phone input" placeholder="请输入手机号" placeholderClass="placeholer-class" onInput={this.onPhoneInput}></Input>
          <Input type="password" className="password input" placeholder="请输入密码" placeholderClass="placeholer-class" onInput={this.onPasswordInput}></Input>
        </View>
        <Button className="login-btn">登录</Button>
      </View>
    )
  }
}