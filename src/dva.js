// import dva from 'dva';
import { create } from 'dva-core';
import createLoading from 'dva-loading';
// import baseModel from './models/base'
let app; // dva实例
let store; // 维持项目所有的 state 树 的一个对象
let dispatch; // 改变store内state的唯一方法
const createApp = (opts) => {
  app = create(opts); // 创建dva实例
  app.use(createLoading({}));
  // 确保所有的state模块也就是model都只注册一次
  if(!global.registered) {
    // 只挂载一次model
    opts.models.forEach(model => app.model(model));
  }
  global.registered = true;
  app.start(); // 运行程序
  store = app._store;
  app.getStore = () => store; // 用函数返回store，确保每次拿到的都是一个全新的对象
  dispatch = store.dispatch;
  app.dispatch = dispatch;
  return app;
}

export default {
  createApp,
  getDispatch: () => {
    return app.dispatch;
  }
}