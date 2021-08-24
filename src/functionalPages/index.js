import Taro, { getCurrentInstance } from '@tarojs/taro';

// const pageComponents = {
//   webview: '/functionalPages/webview/webview',
// }
const getCurrentPage = function() {
  let page
  try {
    page = getCurrentInstance().page

    return page
    // page = pages && pages.length ? pages[pages.length - 1] : null
  } catch (e) {
    page = Taro.getApp().getCurrentPage()
  }

  return page
}
const currentPage = getCurrentPage()
const toWebview = (args) => currentPage.navigateTo(...args)

export default {
  toWebview
}