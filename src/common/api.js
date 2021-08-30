import tools from '@/common/tools'
// 首页
// const API_PRE = "http://localhost:3000"
const API_PRE = "http://101.132.140.113"
// 营销广告
export const adsReq = (data) => tools.request({
  url: `${API_PRE}/ads/advertising`,
  params: data,
})

// 城市列表
export const airportCityListReq = (data) => tools.request({
  url: `${API_PRE}/city/airportList`,
  params: data,
})

// 航班列表
export const flightListReq = (data) => tools.request({
  url: `${API_PRE}/list/singleList`,
  params: data,
})

// 登录
export const loginReq = (data) => tools.request({
  url: `${API_PRE}/login`,
  params: data,
  method: 'POST'
})

// 订票
export const orderReq = (data) => tools.request({
  url: `${API_PRE}/order/order`,
  params: data,
  method: 'POST'
})

// 查询订票
export const orderListReq = (data) => tools.request({
  url: `${API_PRE}/order/getOrderList`,
  params: data,
  method: 'POST'
})