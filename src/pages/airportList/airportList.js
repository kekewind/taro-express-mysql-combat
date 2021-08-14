import { PureComponent } from "react";
import { View, ScrollView } from "@tarojs/components";
import { airportCityListReq } from "@/common/api";
import tools from "@/common/tools";
import { ERR_MES } from "@/common/constant";

import CityItem from './components/cityItem'

import './airportList.scss'

export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      letterList: [], // 首字母列表
      cityListObj: {},
      currentLetter: "", // 当前选中的字母
    };
  }
  componentDidMount() {
    this.getCityList();
  }
  getCityList = () => {
    tools.showLoading();
    airportCityListReq()
      .then((res) => {
        const { result } = res;
        const cityListObj = this.formatList(result)
        const letterList = Object.keys(cityListObj)
        this.setState({
          letterList,
          cityListObj,
        });
      })
      .catch((err) => {
        const { message } = err;
        if (message) {
          tools.showToast(message);
        } else {
          tools.showToast(ERR_MES);
        }
      })
      .finally(() => {
        tools.hideLoading();
      })
  }
  formatList = (list) => {
    const obj = {}
    if (list?.length) {
      list.map((ele) => {
        const firstLetter = ele.firstLetter
        if (!obj[firstLetter]) {
          // 以每个字母为一个模块进行分割
          obj[firstLetter] = []
        }
        obj[firstLetter].push(ele)
      })
    }
    return obj
  }
  onLetterClick = (letter) => {
    this.setState({
      currentLetter: letter
    })
  }
  render() {
    const { cityListObj, letterList, currentLetter } = this.state;
    return (
      <View className="airport-list-container">
        <ScrollView scrollY scrollWithAnimation style={{ height: "100vh" }} scrollIntoView={currentLetter}>
          {
            letterList?.map(item => {
              const cityList = cityListObj[item]
              return (
                <CityItem
                  key={item}
                  label={item}
                  cityList={cityList}
                />
              )
            })
          }
        </ScrollView>
        <View className="letter-container">
          {
            letterList?.map(item => {
              return (
                <View className="letter-item" onClick={() => this.onLetterClick(item)}>
                  {item}
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }
}
