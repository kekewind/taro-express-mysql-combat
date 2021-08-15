import { PureComponent } from "react";
// import { connect } from 'react-redux'
import { View } from "@tarojs/components";
import NoExploit from "@/components/NoExploit";

import "./index.scss";

// 页面级组件
import FlightIndex from '../flight/index/index'

// 主tab list
const DEFAULT_TAB_LIST = [
  { title: "机票", tab: "flight" },
  { title: "火车票", tab: "train" },
  { title: "酒店", tab: "hotel" },
  { title: `汽车票`, tab: "bus" },
];

// @connect(({users}) => ({
//   users
// }))

export default class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tab: DEFAULT_TAB_LIST[0]["tab"],
    };
  }
  switchTab(tab) {
    if (tab === this.state.tab) return;
    this.setState({
      tab,
    });
  }

  render() {
    const { tab } = this.state;
    return (
      <View className="index-container">
        <View className="top">
          <View className="index-tab">
            {DEFAULT_TAB_LIST.map((item) => (
              <View
                key={item.tab}
                className={`index_tab_item ${item.tab} ${
                  tab === item.tab ? "current" : ""
                }`}
                onClick={() => this.switchTab(item.tab)}
              >
                {item.title}
              </View>
            ))}
            <View
              className="scrollbar"
              style={`width:${100 / DEFAULT_TAB_LIST.length}%`}
            ></View>
          </View>
        </View>
        <FlightIndex
          show={tab === DEFAULT_TAB_LIST[0]['tab']}
        ></FlightIndex>
        <View hidden={tab === DEFAULT_TAB_LIST[0]['tab']}>
          <NoExploit />
        </View>
      </View>
    );
  }
}
