import React, { PureComponent } from "react"
import { View, Text, Image } from "@tarojs/components"

import './index.scss'

export const FLIGHT_TABS_MAP = {
  single: 0, // 单程
  round: 1, // 往返
  multi: 2, // 多程
}
// 机票tab标签
export const FLIGHT_TABS = [
  {
    label: '单程',
    value: FLIGHT_TABS_MAP['single'],
  },,
  {
    label: '往返',
    value: FLIGHT_TABS_MAP['round'],
  },
  {
    label: '多程',
    value: FLIGHT_TABS_MAP['multi'],
  },
]

export default class Flight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      flightTab: FLIGHT_TABS_MAP['single'],
    }
  }
  switchFlightInnerTab = (value) => {
    if (value === this.state.flightTab) return
    this.setState({
      flightTab: value,
    })
  }
  render() {
    const {
      flightTab,
    } = this.state
    const {
      show,
    } = this.props
    return (
      <View className={`flight-container ${show ? '' : 'hidden'}`}>
        <View className="flight-top">
          <View className="flight-tab">
            {FLIGHT_TABS.map(item => {
              return (
                <View
                  key={item.value}
                  className={'flt-tab-item ' + (item.value == flightTab ? 'current' : '')}
                  data-type={item.value}
                  onClick={() => this.switchFlightInnerTab(item.value)}
                >
                  {item.label}
                </View>
              )
            })}
            <View className="scrollbar" style={`width: ${100 / FLIGHT_TABS.length}&`}></View>
          </View>
          {/*  单程  */}
          {/* {flightInnerType == FLIGHT_TABS_MAP['single'] && (
            <View>
              <View className="item station">
                <View
                  className={'cell from ' + (flightQuery.domestic.exchange ? 'slide' : '')}
                  data-type="d"
                  onClick={this.chooseFlightCity.bind(this)}
                >
                  {flightQuery.domestic.dptAName || flightQuery.domestic.dptName}
                </View>
                <View
                  className={'cell to ' + (flightQuery.domestic.exchange ? 'slide' : '')}
                  data-type="a"
                  onClick={this.chooseFlightCity.bind(this)}
                >
                  {flightQuery.domestic.arrAName || flightQuery.domestic.arrName}
                </View>
                <View
                  className={'switch ' + (flightQuery.domestic.exchange ? 'active' : '')}
                  onClick={this.exchangeFlightStation.bind(this)}
                >
                  <Text className="ifont-chage iconfont"></Text>
                </View>
              </View>
              <View className="item wangfan">
                <View className="onward" onClick={this.chooseFlightDate.bind(this)}>
                  <View className="pr">
                    <Text>{flightQuery.dptDateStr}</Text>
                    <Text className="small">{flightQuery.dptWeek}</Text>
                  </View>
                </View>
              </View>
            </View>
          )} */}
        </View>
      </View>
      
    )
  }
}