import { PureComponent } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Picker,
  Block,
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { MIN_DATE, MAX_DATE, ERR_MES } from "@/common/constant";
import dayjs from "dayjs";
import { weekDay } from "@/common/utils";
import { flightListReq } from "@/common/api";
import tools from "@/common/tools";
import Skeleton from "taro-skeleton";
import { connect } from "react-redux";
// import VirtualList from "@/components/VirtualList";

import "taro-skeleton/dist/index.css"; // 引入组件样式
import "./list.scss";

@connect(({ base }) => ({
  base,
}))
export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateList: this.formatDateList(),
      flightData: {}, // 航班参数
      flightList: [],
      listTop: 0, // 列表距离页面顶部的距离
      flightCompanyList: [], // 航司列表
      curAirCompanyIndex: "", // 当前选中的下标
      scrollTop: "",
    };
    this.initFlightList = [];
  }
  componentDidMount() {
    const { params } = getCurrentInstance().router;
    console.log("--params", params);
    const {
      dptCityId,
      dptCityName,
      arrCityId,
      arrCityName,
      dptDate,
      arrAirportName,
      dptAirportName,
    } = params;
    this.setState(
      {
        flightData: {
          dptCityId,
          dptCityName,
          arrCityId,
          arrCityName,
          dptDate,
          arrAirportName,
          dptAirportName,
        },
      },
      () => {
        this.getList();
      }
    );
    Taro.setNavigationBarTitle({
      title: `${dptCityName} - ${arrCityName}`,
    });
  }
  getList = () => {
    const { flightData } = this.state;
    tools.showLoading();
    this.setState({
      scrollTop: "",
    });
    flightListReq({
      ...flightData,
    })
      .then((res) => {
        const { result } = res;
        const companyArr = result.map((item) => item.airCompanyName);
        this.setState({
          flightList: result,
          flightCompanyList: [...new Set(companyArr)],
          scrollTop: 0,
        });
        this.initFlightList = result;
      })
      .catch((err) => {
        tools.showToast(err.message || ERR_MES);
      })
      .finally(() => {
        tools.hideLoading();
        Taro.nextTick(this.getListInfo);
      });
  };
  getListInfo = () => {
    const query = Taro.createSelectorQuery();
    query.select("#flight-list").boundingClientRect();
    query.exec((res) => {
      this.setState({
        listTop: res?.[0]["top"] || 0,
      });
    });
  };
  formatDateList = () => {
    let minStr = dayjs(MIN_DATE).valueOf();
    const maxStr = dayjs(MAX_DATE).valueOf();
    const dayStr = 1000 * 60 * 60 * 24; // 一天
    let res = [];
    for (; minStr <= maxStr; minStr += dayStr) {
      res.push({
        dateStr: dayjs(minStr).format("YYYY-MM-DD"),
        day: dayjs(minStr).format("M-DD"),
        week: weekDay(minStr),
      });
    }
    return res;
  };
  chooseDate = (date) => {
    this.setState(
      {
        flightData: {
          ...this.state.flightData,
          dptDate: date,
        },
      },
      this.getList
    );
  };
  onAirCompanyChange = (e) => {
    const { value } = e.detail;
    const { flightCompanyList } = this.state;
    this.setState(
      {
        curAirCompanyIndex: value,
        scrollTop: "",
      },
      () => {
        const res = this.initFlightList.filter(
          (item) => item.airCompanyName === flightCompanyList[value]
        );
        this.setState({
          flightList: res,
          scrollTop: 0,
        });
      }
    );
  };
  onFlightClick = (curFlight) => {
    this.props.dispatch({
      type: "base/updateState",
      payload: {
        selectedFlightData: { ...curFlight },
      },
    });
    tools.navigateTo({
      url: "/pages/flight/detail/detail",
      data: { ...curFlight },
    });
  };
  // handleRender = (flight) => {
  //   const {
  //     dptAirportName,
  //     dptTimeStr,
  //     arrTimeStr,
  //     arrAirportName,
  //     airIcon,
  //     airCompanyName,
  //     price,
  //   } = flight;
  //   return (
  //     <View
  //       key={flight.id}
  //       className="list-item"
  //       onClick={() => this.onFlightClick(flight)}
  //     >
  //       <View className="item-price">
  //         <View className="flight-row">
  //           <View className="depart">
  //             <Text className="flight-time">{dptTimeStr}</Text>
  //             <Text className="airport-name">{dptAirportName}</Text>
  //           </View>
  //           <View className="separator">
  //             <View className="spt-arr"></View>
  //           </View>
  //           <View className="arrival">
  //             <Text className="flight-time">{arrTimeStr}</Text>
  //             <Text className="airport-name">{arrAirportName}</Text>
  //           </View>
  //         </View>
  //         <Text className="flight-price color-red">¥ {price}</Text>
  //       </View>
  //       <View className="air-info">
  //         <Image class="logo" src={airIcon} />
  //         <Text className="company-name">{airCompanyName}</Text>
  //       </View>
  //     </View>
  //   );
  // };
  render() {
    const {
      flightData,
      dateList,
      flightList,
      listTop,
      flightCompanyList,
      curAirCompanyIndex,
      scrollTop,
    } = this.state;
    const { dptDate } = flightData;
    return (
      <View className="list-container">
        <View className="calendar-list">
          <ScrollView
            className="calendar-scroll-list"
            scrollX
            scrollWithAnimation
            scrollIntoView={`date-${dptDate}`}
          >
            {dateList.map((date) => {
              return (
                <View
                  key={date}
                  className={`item ${
                    date.dateStr === dptDate ? "cur bgcolor-primary" : ""
                  }`}
                  id={`date-${date.dateStr}`}
                  onClick={() => this.chooseDate(date.dateStr)}
                >
                  <View className="date">{date.day}</View>
                  <View className="week">{date.week}</View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        {/* 优化章节：虚拟列表 */}
        {/* {flightList?.length ? (
          <View id="flight-list" style={{ paddingTop: `${listTop ? listTop : 57}px` }}>
            <VirtualList className="flight-scroll-list" list={flightList} onRender={this.handleRender} />
          </View>
        ) : (
          <View style={{ paddingTop: `${listTop ? listTop : 57}px` }}>
            {Array(7)
              .fill(0)
              .map((item, index) => {
                return <Skeleton key={index} row={3} action rowHeight={34} />;
              })}
          </View>
        )} */}

        {flightList?.length ? (
          <View
            id="flight-list"
            style={{ paddingTop: `${listTop ? listTop : 57}px` }}
          >
            <ScrollView
              className="flight-scroll-list"
              scrollY
              scrollTop={scrollTop}
            >
              {flightList?.map((flight, index) => {
                const {
                  dptAirportName,
                  dptTimeStr,
                  arrTimeStr,
                  arrAirportName,
                  airIcon,
                  airCompanyName,
                  price,
                } = flight;
                return (
                  <Block key={flight.id}>
                    {
                      index === 3 && (
                        <View className="notice">
                          <Image className="notice-logo" src="https://images3.c-ctrip.com/ztrip/xiaochengxu/shangzhang_zx.png"></Image>
                          <Text className="notice-text">价格可能会上涨，建议尽快预定</Text>
                        </View>  
                      )
                    }
                    <View
                      className="list-item"
                      onClick={() => this.onFlightClick(flight)}
                    >
                      <View className="item-price">
                        <View className="flight-row">
                          <View className="depart">
                            <Text className="flight-time">{dptTimeStr}</Text>
                            <Text className="airport-name">
                              {dptAirportName}
                            </Text>
                          </View>
                          <View className="separator">
                            <View className="spt-arr"></View>
                          </View>
                          <View className="arrival">
                            <Text className="flight-time">{arrTimeStr}</Text>
                            <Text className="airport-name">
                              {arrAirportName}
                            </Text>
                          </View>
                        </View>
                        <Text className="flight-price color-red">
                          ¥ {price}
                        </Text>
                      </View>
                      <View className="air-info">
                        <Image class="logo" src={airIcon} />
                        <Text className="company-name">{airCompanyName}</Text>
                      </View>
                    </View>
                  </Block>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={{ paddingTop: `${listTop ? listTop : 57}px` }}>
            {Array(7)
              .fill(0)
              .map((item, index) => {
                return <Skeleton key={index} row={3} action rowHeight={34} />;
              })}
          </View>
        )}
        {/* 此处用View包裹兼容支付宝的展示 */}
        <View className={`flilter-btn ${flightList?.length ? "" : "hidden"}`}>
          <Picker
            range={flightCompanyList}
            value={curAirCompanyIndex}
            onChange={this.onAirCompanyChange}
          >
            筛选
          </Picker>
        </View>
      </View>
    );
  }
}
