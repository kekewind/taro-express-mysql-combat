import { PureComponent } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Input,
  // Switch
} from "@tarojs/components";
import { connect } from "react-redux";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import loginDecorator from "@/components/LoginDecorator";
import tools from '@/common/tools'
import { orderReq } from '@/common/api'
// import user from '@/common/user';

import "./detail.scss";
import { ERR_MES } from "../../../common/constant";

@loginDecorator
@connect(({ base, user }) => ({
  base,
  user
}))
export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFlightData: {},
      // isChecked: false,
    };
  }
  componentDidMount() {
    const { params } = getCurrentInstance().router;
    this.setState({
      selectedFlightData: {
        ...params,
      },
    });
    console.log("--params", params);

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
  // getPhone = (e) => {
  //   console.log('---e', e)
  // }
  // onSwitchChange = (e) => {
  //   console.log(e)
  //   this.setState({
  //     isChecked: e.detail.value
  //   })
  // }
  onOrder = () => {
    const {
      userPhone,
    } = this.props.user
    const { 
      selectedFlightData,
    } = this.state;
    tools.doLogin(() => {
      tools.showLoading()
      orderReq({
        userPhone,
        orderInfo: selectedFlightData
      })
        .then(() => {
          tools.showToast({
            title: '预定成功...',
            icon: "loading",
            duration: 2000,
          })
            .then(() => {
              // setTimeout(() => {
              Taro.switchTab({
                url: '/pages/order/order'
              })
              // }, 1000)
            })
        })
        .catch(err => {
          tools.showToast(err?.data?.mes || ERR_MES)
        })
        .finally(() => {
          tools.hideLoading()
        })
    })
  }
  render() {
    const { 
      selectedFlightData,
      // isChecked
    } = this.state;
    const {
      airCompanyName,
      airIcon,
      arrAirportName,
      arrTimeStr,
      dptAirportName,
      dptTime,
      dptTimeStr,
      price,
    } = selectedFlightData;
    console.log(this.props)
    const {
      isLogin,
      userPhone,
      nickName
    } = this.props.user
    return (
      <View className="detail-container">
        <View className="flight-segment">
          <View className="info-head">
            <View className="tag">直飞</View>
            <View className="company-info">
              <Image src={airIcon} className="logo"></Image>
              {`${airCompanyName} ${dayjs(dptTime).format("M月D日")}`}
            </View>
          </View>
          <View className="info-detail">
            <View className="from">
              <View className="time">{dptTimeStr}</View>
              <View className="station">{dptAirportName}</View>
            </View>
            <Image
              className="mid"
              src="https://pic.c-ctrip.com/train/zt/flight/bookx/icon-fromto.png"
            ></Image>
            <View className="to">
              <View className="time">{arrTimeStr}</View>
              <View className="station">{arrAirportName}</View>
            </View>
          </View>
        </View>
        <View className="passenger-box module-box">
          <Text className="title">乘机人</Text>
          {
            isLogin ? <View className="name">{nickName}</View> : <Button className="add-btn name" onClick={tools.goLoginPage}>新增</Button>
          }
        </View>
        <View className="passenger-box module-box">
          <Text className="title">联系手机</Text>
          <View className="phone-box">
            <Text className="num-pre">+86 </Text>
            <Input disabled placeholder="请输入乘机人手机号" value={userPhone}></Input>
          </View>
        </View>
        {/* 测试Taro bug */}
        {/* <Switch
          // checked={isChecked}
          onChange={this.onSwitchChange}
        ></Switch>
        <View>
          {
            isChecked ? (
              <View className="module-box">
                <Text className="title">保险</Text>
                <View className="insurance-name">
                  <Text>人身意外险</Text>
                  <Text>¥ 30/人</Text>
                </View>
              </View>
            ) : null
          }
        </View> */}
        <View className="price-item">
          <View className="color-red">
            ¥ <Text className="price color-red">{price}</Text>
          </View>
          <View className="order-btn" onClick={this.onOrder}>订</View>
        </View>
        {/*  机票底部  */}
        <View className="flight-info"></View>
      </View>
    );
  }
}
