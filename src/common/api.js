import tools from '@/common/tools'
// 首页
const API_PRE = "http://localhost:3000"
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