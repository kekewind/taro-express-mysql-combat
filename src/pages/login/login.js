/* eslint-disable react/no-unused-state */
import { PureComponent } from "react";
import { View, Input, Button } from "@tarojs/components";
import Taro from '@tarojs/taro';
import { debounce } from '@/common/utils';
import { loginReq } from '@/common/api';
import { ERR_MES } from '@/common/constant';
import { connect } from 'react-redux';
import tools from '@/common/tools';

import './login.scss';

@connect(({user}) => ({
  ...user
}))
export default class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      userPhone: "",
      password: "",
      nickName: "",
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
      userPhone: e.detail.value,
    })
  }, 300)
  onPasswordInput = debounce((e) => {
    this.setState({
      password: e.detail.value,
    })
  }, 300)
  onNameInput = debounce((e) => {
    this.setState({
      nickName: e.detail.value,
    })
  }, 300)
  onLogin = () => {
    const {
      userPhone,
      password,
      nickName
    } = this.state
    if (!userPhone || !password || !nickName) {
      return tools.showToast('所有内容必须填写完毕~')
    }
    const reg = /^1[3-9]\d{9}$/
    if (!reg.test(userPhone)) {
      return tools.showToast('请填写正确手机号~')
    }

    tools.showLoading()
    loginReq({
      userPhone,
      password,
      nickName,
      // clientType: Taro.getEnv(),
    })
      .then(res => {
        const { code, result } = res
        if (code === 1) {
          tools.setStorageSyncWithTime('userInfo', {
            userPhone: result.userPhone,
            nickName: result.nickName,
          })
          this.props.dispatch({
            type: 'user/updateState',
            payload: {
              isLogin: !!result.userPhone,
              userPhone: result.userPhone,
              nickName: result.nickName
            }
          })
          Taro.navigateBack()
        }
      })
      .catch(err => {
        const { data } = err
        if (data?.mes) {
          tools.showToast(data.mes)
          return
        }
        tools.showToast(ERR_MES)
      })
      .finally(() => {
        tools.hideLoading()
      })
  }
  render() {
    return (
      <View className="login-container">
        <View className="login-top">
          <View>你好，</View>
          <View>欢迎登录</View>
        </View>
        <View className="login-box">
          <Input type="text" className="nick-name input" placeholder="请输入昵称" placeholderClass="placeholer-class" onInput={this.onNameInput}></Input>
          <Input type="text" className="phone input" placeholder="请输入手机号" placeholderClass="placeholer-class" onInput={this.onPhoneInput}></Input>
          <Input type="password" className="password input" placeholder="请输入密码" placeholderClass="placeholer-class" onInput={this.onPasswordInput}></Input>
        </View>
        <Button className="login-btn" onClick={this.onLogin}>登录</Button>
      </View>
    )
  }
}