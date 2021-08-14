import { PureComponent } from "react";
import { AtCalendar } from 'taro-ui'
import { View } from "@tarojs/components";
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import Taro from '@tarojs/taro';

import './calendar.scss'

const MIN_DATE = dayjs().format('YYYY-MM-DD')
const MAX_DATE = dayjs().add(60, 'day').format('YYYY-MM-DD')

@connect(({flightIndex}) => ({
  ...flightIndex
}))
export default class Main extends PureComponent {
  onDateSelect = (date) => {
    const { value: { start } } = date
    this.props.dispatch({
      type: 'flightIndex/updateState',
      payload: {
        dptDate: start,
      }
    })
    Taro.navigateBack()
  }
  render() {
    const { dptDate } = this.props
    return (
      <View className="calendar-page">
        <AtCalendar
          currentDate={dptDate}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
          onSelectDate={this.onDateSelect}
        />
      </View>
    )
  }
}