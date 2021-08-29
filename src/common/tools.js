import Taro from '@tarojs/taro';
import { USER_VALID_TIME } from '@/common/constant';

const tools = {
  request: (opts) => {
    const {
      url = "",
      params = {},
      method = "GET",
    } = opts
    return new Promise((resolve, reject) => {
      Taro.request({
        url,
        data: params,
        method,
      })
        .then((res) => {
          const { data } = res
          if (data?.code === 1) {
            // 请求成功且数据正常
            resolve(data)
          } else {
            reject(res)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  showToast: (param) => {
    let dptOpts = {
      title: '温馨提示',
      icon: 'none',
      mask: true,
      duration: 2000,
    }
    if (Object.prototype.toString.call(param) === "[object String]") {
      dptOpts.title = param
    } else if (Object.prototype.toString.call(param) === "[object Object]") {
      dptOpts = {
        ...dptOpts,
        ...param,
      }
    } else {
      throw new Error('参数类型有误，应该是字符串或对象')
    }
    return Taro.showToast(dptOpts)
  },
  showLoading: (param = "") => {
    let dptOpts = {
      title: '加载中...',
      mask: true, // 防止触摸穿透
    }
    if (param && Object.prototype.toString.call(param) === "[object String]") {
      dptOpts.title = param
    } else if (param && Object.prototype.toString.call(param) === "[object Object]") {
      dptOpts = {
        ...dptOpts,
        ...param,
      }
    }
    return Taro.showLoading(dptOpts)
  },
  hideLoading: () => {
    return Taro.hideLoading()
  },
  navigateTo: ({url, data}) => {
    let searchKeys = []
    if (Object.prototype.toString.call(data) === "[object Object]" && Object.keys(data).length) {
      for(let key in data) {
        searchKeys.push(`${key}=${data[key]}`)
      }
    }
    const searchStr = searchKeys.join('&');
    console.log('searchStr', searchStr)
    return Taro.navigateTo({
      url: `${url}?${searchStr}`
    })
  },
  setStorageSyncWithTime: (key, value) => {
    try {
      const startTime = Date.now()
      Taro.setStorageSync(key, {
        [key]: value,
        startTime,
      })
    } catch(err) {
      console.error(err)
    }
  },
  /**
   * 
   * @{time} 缓存有效时间，单位秒	 
   */
  getStorageSyncWithTime: (key, time) => {
    try {
      const result = Taro.getStorageSync(key)
      const { startTime } = result
      const expiredTime = startTime + time * 1000
      if (Date.now() > expiredTime) {
        Taro.removeStorageSync(key)
      } else {
        return result[key]
      }
    } catch(err) {
      console.error(err)
    }
  },
  isAliPay: () => {
    return Taro.ENV_TYPE.ALIPAY === Taro.getEnv() 
  },
  isBaiDu: () => {
    return Taro.ENV_TYPE.SWAN = Taro.getEnv()
  },
  isWeChat: () => {
    return Taro.ENV_TYPE.WEAPP = Taro.getEnv()
  },
  isH5: () => {
    return Taro.ENV_TYPE.WEB = Taro.getEnv()
  },
  /**
   * 
   * @{param}	 fn 如果判断登录了就执行fn
   */
  doLogin: (fn) => {
    const user = tools.getStorageSyncWithTime('userInfo', USER_VALID_TIME)
    if (!user?.userPhone) {
      tools.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      fn?.()
    }
  }
}

export default tools