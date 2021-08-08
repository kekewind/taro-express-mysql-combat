import React, { PureComponent } from "react";
import { View, SwiperItem, Text, Block, Button, Image } from "@tarojs/components";
import Tab from "@/components/Tab";
import NoExploit from "@/components/NoExploit";
import { sleep } from '@/common/utils';
import { FLIGHT_TABS_MAP } from '@/common/constant';

import "./index.scss";

// 机票tab标签
export const FLIGHT_TABS = [
  {
    label: "单程",
    id: FLIGHT_TABS_MAP["single"],
  },
  {
    label: "往返",
    id: FLIGHT_TABS_MAP["round"],
  },
  {
    label: "多程",
    id: FLIGHT_TABS_MAP["multi"],
  },
];

export default class Flight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flightTab: FLIGHT_TABS_MAP["single"],
      dptCityName: '上海',
      arrCityName: '北京',
      isExchange: false,
    };
  }
  switchFlightInnerTab = (value) => {
    if (value === this.state.flightTab) return;
    this.setState({
      flightTab: value,
    });
  };
  chooseFlightCity = () => {

  }
  chooseFlightDate = () => {

  }
  exchangeCity = async () => {
    const { dptCityName, arrCityName } = this.state
    this.setState({
      isExchange: true,
      dptCityName: arrCityName,
      arrCityName: dptCityName,
    })
    await sleep(500)
    this.setState({
      isExchange: false,
      dptCityName: arrCityName,
      arrCityName: dptCityName,
    })
  }
  render() {
    const { flightTab, dptCityName, arrCityName, isExchange } = this.state;
    const { show } = this.props;
    return (
      <View className={`flight-container ${show ? "" : "hidden"}`}>
        <View className="flight-top">
          <Tab tabList={FLIGHT_TABS} className="flight-index-tab">
            {/*  单程  */}
            <SwiperItem>
              <View className="item station">
                <View
                  className={`cell from ${isExchange ? 'slide' : ''}`}
                  onClick={this.chooseFlightCity}
                >
                  {dptCityName}
                </View>
                <Text onClick={this.exchangeCity} className={`icon-zhihuan icon iconfont ${isExchange ? 'active' : ''}`}></Text>
                <View
                  className={`cell to ${isExchange ? 'slide' : ''}`}
                  onClick={this.chooseFlightCity}
                >
                  {arrCityName}
                </View>
              </View>
              <View className="item date" onClick={this.chooseFlightDate}>
                7月8日
              </View>
              <Button className="search-btn">机票查询</Button>
            </SwiperItem>
            {/*  往返  */}
            <SwiperItem><NoExploit /></SwiperItem>
            {/*  多程  */}
            <SwiperItem><NoExploit /></SwiperItem>
          </Tab>
        </View>
      </View>
    );
  }
}
