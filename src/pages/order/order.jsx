import { PureComponent } from "react";
import { View, Image, Text, SwiperItem, Button } from "@tarojs/components";
import Tab from "@/components/Tab";
import NoExploit from "@/components/NoExploit";

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
export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
    };
  }
  render() {
    const { isLogin } = this.state;
    return isLogin ? (
      <View className="home-container">
        <View className="user-box">
          <Image src="" className="avatar"></Image>
          <Text className="user-name">不浪</Text>
          <Text className="login-out-btn">退出</Text>
        </View>
        <Tab tabList={TAB_LIST} className="tab">
          {TAB_LIST.map((tab) => {
            return (
              <SwiperItem key={tab.id}>
                {tab.id === 0 ? (
                  <NoExploit content="暂无数据" />
                ) : (
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
        <Button className="login-btn">立即登录</Button>
      </View>
    );
  }
}
