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