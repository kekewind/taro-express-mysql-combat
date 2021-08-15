import { PureComponent } from "react";
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import { View, Text } from "@tarojs/components";

import './index.scss';

@connect(({flightIndex}) => ({
  ...flightIndex
}))
export default class CityItem extends PureComponent {
  onCityClick = (cityInfo) => {
    const { cityType } = this.props
    const {
      cityId,
      cityName,
    } = cityInfo
    console.log('cityType', cityType)
    this.props.dispatch({
      type: 'flightIndex/updateState',
      payload: cityType === "depart" ? {
        dptCityId: cityId,
        dptCityName: cityName
      } : {
        arrCityId: cityId,
        arrCityName: cityName,
      }
    })
    Taro.navigateBack()
  }
  render() {
    const { cityList, label } = this.props
    return (
      <View className="list-item" id={label}>
        <Text className="label">{label}</Text>
        {
          cityList?.map(item => {
            return <View key={item.id} className="name" onClick={() => this.onCityClick(item)}>{item.cityName}</View>
          })
        }
      </View>
    )
  }
}