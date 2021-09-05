/* eslint-disable import/no-commonjs */
const isH5 = process.env.TARO_ENV === "h5"
console.log('--isH5', isH5)
const HOST = "http://101.132.140.113"

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    // HOST: isH5 ? '"/api"' : HOST
  },
  mini: {},
  h5: {
    devServer: {
      // host: '192.168.0.118',
      // port: 10086,
      proxy: [
        {
          // context: ['/ads', '/city', '/list', '/'],
          context: ['/'],
          target: HOST,
          changeOrigin: true,
        }
      ]
      // proxy: {
      //   '/ads': HOST,
      // }
    }
  }
}
