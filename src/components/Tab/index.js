import { View, Swiper } from '@tarojs/components';
import { PureComponent } from 'react'
import PropsTypes from 'prop-types'

import './index.scss'

/**
 * 要点
 * 1. 规定tabList每一项的属性值必须符合组件内的要求
 * [{
 *  id: number,
 *  label: string,
 * }]
 */
export default class Tab extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentId: 0, // 唯一id
    }
  }
  componentDidMount() {
    const { initTab, tabList } = this.props
    if (initTab == undefined) {
      // 没有设置initTab，取列表第一个tab
      this.setState({
        currentId: tabList?.[0]['id']
      })
    } else {
      this.setState({
        currentId: initTab,
      })
    }
  }
  handleClick = (id) => {
    this.setState({
      currentId: id
    })
  }
  handleChange = (e) => {
    this.setState({
      currentId: e.detail.current,
    }, () => {
      // 链式判断运算符
      // 将当前id传递给父组件
      this.props.onChange?.(e)
    })
  }
  render() {
    const { currentId } = this.state
    const { tabList, children, className } = this.props
    return (
      <View className={`tab-container ${className}`}>
        <View className="tab-bar">
          {
            tabList?.map(item => {
              return (
                <View className={`tab-item ${currentId === item['id'] ? 'active' : ''}`} key={item['id']} onClick={() => this.handleClick(item['id'])}>
                  { item.label }
                </View>
              )
            })
          }
          <View className="scroll-bar" style={{width: `${100 / tabList?.length}%`}}></View>
        </View>
        <Swiper
          current={currentId}
          className="tab-content"
          onChange={this.handleChange}
        >
          {children}
        </Swiper>
      </View>
    )
  }
}

Tab.defaultProps = {
  tabList: [],
}

Tab.propTypes = {
  tabList: PropsTypes.array.isRequired,
  children: PropsTypes.element,
  onChange: PropsTypes.func,
  className: PropsTypes.string,
  initTab: PropsTypes.number // 初始化tab
}