import path from 'path'
import GLOBAL_CONSTANT from './globalConst'

const TARO_ENV = process.env.TARO_ENV
console.log('taro--env--', TARO_ENV)
const config = {
  projectName: 'taro-express-mysql-combat',
  date: '2021-8-7',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${TARO_ENV}`,
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  sass: {
    data: GLOBAL_CONSTANT, // 全局变量
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/common': path.resolve(__dirname, '..', 'src/common')
  },
  mini: {
    // prerender: {
    //   match: 'pages/flight/**', // 所有以 `pages/flight` 开头的页面都参与 prerender
    //   exclude: ['pages/flight/index/index'] // `pages/flight/index/index` 不用参与 prerender
    // },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui', 'taro-skeleton'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
