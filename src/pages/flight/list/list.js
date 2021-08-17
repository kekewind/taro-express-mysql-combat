import { PureComponent } from "react";
import { View, ScrollView, Text } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { MIN_DATE, MAX_DATE, ERR_MES } from "@/common/constant";
import dayjs from "dayjs";
import { weekDay } from "@/common/utils";
import { flightListReq } from "@/common/api";
import tools from "@/common/tools";

import "./list.scss";

export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateList: this.formatDateList(),
      flightData: {}, // 航班参数
      flightList: [],
    };
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
    flightListReq({
      ...flightData,
    })
      .then((res) => {
        const { result } = res;
        this.setState({
          flightList: result,
        });
      })
      .catch((err) => {
        tools.showToast(err.message || ERR_MES);
      })
      .finally(() => {
        tools.hideLoading();
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
    this.setState({
      flightData: {
        dptDate: date,
      }
    });
  };
  render() {
    const { flightData, dateList, flightList } = this.state;
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
        <ScrollView className="flight-scroll-list" scrollY>
          {flightList?.map((flight) => {
            const {
              dptAirportName,
              dptTimeStr,
              arrTimeStr,
              arrAirportName,
              // airIcon,
              // ariCompanyName,
              // price,
            } = flight
            return (
              <View
                className="fltlist_item"
                // onClick={this.handleFlightClick}
              >
                <View className="flt_intro">
                  <View className="flt_col">
                    <View className="flt_depart">
                      <Text className="flt_time">{dptTimeStr}</Text>
                      <Text className="torage flt_airport">
                        {dptAirportName}
                      </Text>
                    </View>
                    {/* <View className="separator">
                      {flight.abbr && (
                        <View className="spt_type">{flight.abbr}</View>
                      )}
                      <View className="spt_arr"></View>
                    </View> */}
                    <View className="flt_arrival">
                      <Text className="flt_time">{arrTimeStr}</Text>
                      <Text className="torage flt_airport">{arrAirportName}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
