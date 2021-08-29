import { PureComponent } from "react";
import { View, Text, SwiperItem, Button, ScrollView } from "@tarojs/components";
import Tab from "@/components/Tab";
import NoExploit from "@/components/NoExploit";
import tools from "@/common/tools";
import loginDecorator from "@/components/LoginDecorator";
import { connect } from "react-redux";
import { orderListReq } from "@/common/api";
import { ERR_MES } from "@/common/constant";
import dayjs from "dayjs";

import "./order.scss";

const TAB_LIST = [
  {
    label: "机票",
    id: 0,
  },
  {
    label: "火车票",
    id: 1,
  },
  {
    label: "酒店",
    id: 2,
  },
  {
    label: "汽车票",
    id: 3,
  },
];

@loginDecorator
@connect(({ user }) => ({
  ...user,
}))
export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
    };
  }
  componentDidMount() {
    this.getOrderList();
  }
  componentDidShow() {
    console.log('--did show---')
    this.getOrderList();
  }
  getOrderList = () => {
    tools.showLoading();
    const { userPhone } = this.props;
    orderListReq({
      userPhone,
    })
      .then((res) => {
        const { result } = res;
        this.setState({
          orderList: result || [],
        });
      })
      .catch((err) => {
        tools.showToast(err?.data?.mes || ERR_MES);
      })
      .finally(() => {
        tools.hideLoading();
      });
  }
  toLogin = () => {
    tools.navigateTo({
      url: "/pages/login/login",
    });
  };
  renderListItem = () => {
    const { orderList } = this.state;
    return orderList?.length ? (
      <ScrollView scrollY style={{height: '100%'}} className="order-list-box">
        {orderList.map((item) => {
          const { dptCityName, arrCityName, dptTime, dptTimeStr, price } = item;
          return (
            <View key={item.id} className="item">
              <View className="left">
                <View className="line">
                  <Text className="city-name">{dptCityName}</Text> - 
                  <Text className="city-name">{arrCityName}</Text>
                  <View className="time">{`${dayjs(dptTime).format(
                    "YYYY-MM-DD"
                  )} ${dptTimeStr}`}</View>
                </View>
              </View>
              <View className="right">¥ {price}</View>
            </View>
          );
        })}
      </ScrollView>
    ) : (
      <NoExploit content="暂无数据" />
    );
  };
  render() {
    const { isLogin, nickName } = this.props;

    return isLogin ? (
      <View className="home-container">
        <View className="user-box">
          {/* <Image src="" className="avatar"></Image> */}
          <Text className="user-name">欢迎，{nickName || "--"}</Text>
          <Text className="login-out-btn">退出</Text>
        </View>
        <Tab tabList={TAB_LIST} className="tab">
          {TAB_LIST.map((tab) => {
            return (
              <SwiperItem key={tab.id}>
                {tab.id === 0 ? (this.renderListItem()) : (
                  <NoExploit content="暂无数据" />
                )}
              </SwiperItem>
            );
          })}
        </Tab>
      </View>
    ) : (
      <View className="no-login-container">
        <Text className="txt">登录查看订单</Text>
        <Button className="login-btn" onClick={this.toLogin}>
          立即登录
        </Button>
      </View>
    );
  }
}
