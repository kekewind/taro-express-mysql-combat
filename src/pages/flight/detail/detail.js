import { PureComponent } from "react";
import {
  View,
  Text,
  Button,
  Image,
} from "@tarojs/components";
import { connect } from "react-redux";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import { loginReq } from '@/common/api'
import user from '@/common/user';

import "./detail.scss";

@connect(({ base }) => ({
  base,
}))
export default class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedFlightData: {},
    };
  }
  componentDidMount() {
    console.log("--", this.props.base);
    const { params } = getCurrentInstance().router;
    this.setState({
      selectedFlightData: {
        ...params,
      },
    });
    console.log("--params", params);

    Taro.login()
      .then((res) => {
        console.log(res)
        const { code } = res
        loginReq({
          js_code: code,
          appid: user.appId,
          secret: user.appSecret,
          grant_type: 'authorization_code'
        })
      })
  }
  getPhone = (e) => {
    console.log('---e', e)
  }
  render() {
    const { selectedFlightData } = this.state;
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
        <View className="passenger-box">
          <Text className="title">乘机人</Text>
          <Button openType="getPhoneNumber" onGetPhoneNumber={this.getPhone} className="add-btn name">新增</Button>
          <View className="name">不浪</View>
        </View>
        <View className="price-item">
          <View className="color-red">
            ¥ <Text className="price color-red">{price}</Text>
          </View>
          <View className="order-btn">订</View>
        </View>
        {/*  机票底部  */}
        <View className="flight-info"></View>
      </View>
    );
  }
}
