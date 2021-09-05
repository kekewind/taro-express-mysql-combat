import dayjs from 'dayjs';

/**
 * 延迟
 * @{ms}	 延迟时间ms
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const weekDay = (date = "") => {
  const day = dayjs(date).day()
  switch (day) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 0:
      return '周日'
    default:
      return ''
  }
}

/**
* 防抖函数
*
* @param {Function} fn 要防抖的方法
* @param {number} delay 延迟毫秒数
* @returns {Function} 防抖函数
*/
export const debounce = (fn, delay) => {
  let timer = null
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
/**
 * 将对象解析成url参数
 * @{param}	 
 */
export const objectToString = (obj) => {
  let searchKeys = []
  if (Object.prototype.toString.call(obj) === "[object Object]" && Object.keys(obj).length) {
    for(let key in obj) {
      searchKeys.push(`${key}=${obj[key]}`)
    }
  }
  return searchKeys.join('&');
}

