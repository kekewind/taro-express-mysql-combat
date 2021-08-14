import tools from '@/common/tools'
// 首页
const API_PRE = "http://localhost:3000"
// 营销广告
export const adsReq = (params) => tools.request({
  url: `${API_PRE}/ads/advertising`,
  ...params,
})

// 城市列表
export const airportCityListReq = (params) => tools.request({
  url: `${API_PRE}/city/airportList`,
  ...params,
})