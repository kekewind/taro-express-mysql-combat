import { USER_VALID_TIME } from '@/common/constant';
import tools from "@/common/tools";

const init = () => {
  const userInfo = tools.getStorageSyncWithTime('userInfo', USER_VALID_TIME)
  return {
    isLogin: !!userInfo?.userPhone,
    userPhone: userInfo?.userPhone,
    nickName: userInfo?.nickName
  }
}
export default {
  namespace: 'user',
  state: {
    ...init()
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    loginOut() {
      return {
        ...init()
      }
    }
  },

  effects: {
  },
};