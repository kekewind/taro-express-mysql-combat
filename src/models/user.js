import { USER_VALID_TIME } from '@/common/constant';
import tools from "@/common/tools";

const userInfo = tools.getStorageSyncWithTime('userInfo', USER_VALID_TIME)
const INIT_STATE = {
  isLogin: !!userInfo?.userPhone,
  userPhone: userInfo?.userPhone,
  nickName: userInfo.nickName
}
export default {
  namespace: 'user',
  state: {
    ...INIT_STATE
  },

  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    }
  },

  effects: {
  },
};