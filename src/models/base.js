const INIT_STATE = {
  selectedFlightData: {},
}
export default {
  namespace: 'base',
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