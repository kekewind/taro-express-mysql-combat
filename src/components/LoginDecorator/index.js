import { Component } from 'react';
import { USER_VALID_TIME } from '@/common/constant';
import tools from "../../common/tools";

const IsLogin = (WrappedComponent) => {
  // 函数接收一个组件为参数,并返回一个类组件,继承自Component
  return class extends Component {
    componentDidMount() {
      const store = tools.getStorageSyncWithTime('userInfo', USER_VALID_TIME)
      if (!store?.userPhone) {
        tools.navigateTo({
          url: '/pages/login/login'
        })
      }
    }
    render() {
      return  <WrappedComponent />
    }
  }
}

export default IsLogin