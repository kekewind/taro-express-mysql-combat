/**
 * 延迟
 * @{ms}	 延迟时间ms
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}