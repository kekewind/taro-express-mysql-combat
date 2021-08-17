import dayjs from 'dayjs'

export const FLIGHT_TABS_MAP = {
  single: 0, // 单程
  round: 1, // 往返
  multi: 2, // 多程
};

export const ERR_MES = "网络开了小差，请稍后重试～"

export const MIN_DATE = dayjs().format('YYYY-MM-DD')
export const MAX_DATE = dayjs().add(60, 'day').format('YYYY-MM-DD')