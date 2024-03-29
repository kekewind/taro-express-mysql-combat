import { PureComponent } from "react";
import {
  View,
  SwiperItem,
  Text,
  Button,
  Swiper,
  Image,
} from "@tarojs/components";
import Tab from "@/components/Tab";
import NoExploit from "@/components/NoExploit";
import { sleep } from "@/common/utils";
import { adsReq } from "@/common/api";
import { connect } from "react-redux";
import Taro from "@tarojs/taro";
import { FLIGHT_TABS_MAP } from "@/common/constant";
import dayjs from "dayjs";
import tools from "@/common/tools";

import "./index.scss";

// 机票tab标签
const FLIGHT_TABS = [
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

@connect(({ flightIndex }) => ({
  flightIndex,
}))
export default class Flight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flightTab: FLIGHT_TABS_MAP["single"],
      isExchange: false,
      adList: [], // 活动列表
    };
  }
  componentDidMount() {
    this.getAds();
    this.getLocationInfo()
  }
  getAds = () => {
    adsReq().then((res) => {
      const { result } = res;
      this.setState({
        adList: result || [],
      });
    });
  };
  getLocationInfo = () => {
    Taro.getLocation({
      type: 'gcj02'
    })
      .then(res => {
        const {
          latitude,
          longitude,
        } = res
        this.getCity({latitude, longitude})
      })
      .catch(() => {
        tools.showToast('位置获取失败~')
      })
  }
  getCity = ({latitude, longitude}) => {
    Taro.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?key=JKLBZ-WN3K4-HFSU6-DB5UU-2FGCS-CLB4J&location=${latitude},${longitude}`
    })
      .then(res => {
        console.log(res)
        const {
          data
        } = res
        const cityInfo = data?.result?.ad_info || {}
        this.props.dispatch({
          type: 'flightIndex/updateState',
          payload: {
            dptCityId: cityInfo.city_code || 2,
            dptCityName: cityInfo.city || "上海",
          }
        })
      })
      .catch(() => {
        tools.showToast('位置获取失败~')
      })
  }
  switchFlightInnerTab = (value) => {
    if (value === this.state.flightTab) return;
    this.setState({
      flightTab: value,
    });
  };
  chooseFlightCity = (type) => {
    this.props.dispatch({
      type: "flightIndex/updateState",
      payload: {
        cityType: type,
      },
    });
    Taro.navigateTo({
      url: "/pages/airportList/airportList",
    });
  };
  chooseFlightDate = () => {
    Taro.navigateTo({
      url: "/pages/calendar/calendar",
    });
  };
  exchangeCity = async () => {
    const {
      dptCityName,
      dptCityId,
      arrCityId,
      arrCityName,
      dptAirportName,
      arrAirportName,
    } = this.props.flightIndex;
    const exchangeObj = {
      dptCityName: arrCityName,
      dptCityId: arrCityId,
      arrCityName: dptCityName,
      arrCityId: dptCityId,
      dptAirportName: arrAirportName,
      arrAirportName: dptAirportName,
    };
    this.setState({
      isExchange: true,
    });
    this.props.dispatch({
      type: "flightIndex/updateState",
      payload: exchangeObj,
    });
    await sleep(500);
    this.setState({
      isExchange: false,
    });
    this.props.dispatch({
      type: "flightIndex/updateState",
      payload: exchangeObj,
    });
  };
  onLinkToList = () => {
    const {
      arrCityName,
      arrCityId,
      arrAirportName,
      dptCityId,
      dptCityName,
      dptAirportName,
      dptDate,
    } = this.props.flightIndex;
    tools.navigateTo({
      url: "/pages/flight/list/list",
      data: {
        arrCityName,
        arrCityId,
        dptCityId,
        dptCityName,
        dptDate,
        arrAirportName,
        dptAirportName,
      },
    });
  };
  render() {
    const { isExchange, adList } = this.state;
    const { show, flightIndex } = this.props;
    const { arrCityName, dptCityName, dptDate } = flightIndex;
    return (
      <View className={`flight-container ${show ? "" : "hidden"}`}>
        <View className="flight-top">
          <Tab tabList={FLIGHT_TABS} className="flight-index-tab">
            {/*  单程  */}
            <SwiperItem>
              <View className="item station">
                <View
                  className={`cell from ${isExchange ? "slide" : ""}`}
                  onClick={() => this.chooseFlightCity("depart")}
                >
                  {dptCityName}
                </View>
                <Text
                  onClick={this.exchangeCity}
                  className={`icon-zhihuan iconfont ${
                    isExchange ? "active" : ""
                  }`}
                ></Text>
                <View
                  className={`cell to ${isExchange ? "slide" : ""}`}
                  onClick={() => this.chooseFlightCity("arrive")}
                >
                  {arrCityName}
                </View>
              </View>
              <View className="item date" onClick={this.chooseFlightDate}>
                {dayjs(dptDate).format("M月D日")}
              </View>
              <Button className="search-btn" onClick={this.onLinkToList}>
                机票查询
              </Button>
            </SwiperItem>
            {/*  往返  */}
            <SwiperItem>
              <NoExploit className="no-data" />
            </SwiperItem>
            {/*  多程  */}
            <SwiperItem>
              <NoExploit className="no-data" />
            </SwiperItem>
          </Tab>
        </View>
        <View className="alipay-swiper" style={{margin: '15px'}}>
          <Swiper className="advs-banner-bd" interval={3000} autoplay circular>
            {adList?.map((item) => {
              return (
                <SwiperItem key={item.imgUrl} className="item">
                  <Image
                    className="img"
                    src={item.imgUrl}
                    // onClick={this.onFlightAdClick}
                  ></Image>
                </SwiperItem>
              );
            })}
          </Swiper>
        </View>

        {/*  机票底部  */}
        <View className="flight-info"></View>
      </View>
    );
  }
}
