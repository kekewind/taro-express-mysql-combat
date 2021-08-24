export default {
  pages: [
    'pages/index/index',
    'pages/order/order',
    'pages/login/login',
    'pages/airportList/airportList',
    'pages/calendar/calendar',
    'functionalPages/webview/webview',
    // 'pages/flight/list/list',
    // 'pages/flight/detail/detail',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#7F8389',
    selectedColor: '#5495e6',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'assets/images/index-unselected.png',
        selectedIconPath: 'assets/images/index-selected.png',
        text: '首页',
      },
      {
        pagePath: 'pages/order/order',
        iconPath: 'assets/images/order-unselected.png',
        selectedIconPath: 'assets/images/order-selected.png',
        text: '我的订单',
      },
    ]
  },
  subpackages: [
    {
      root: "pages/flight",
      pages: [
        "list/list",
        "detail/detail",
      ]
    }
  ]
}
