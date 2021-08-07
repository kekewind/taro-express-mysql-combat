// import dva from 'dva';
import { create } from 'dva-core';
import createLoading from 'dva-loading';
// import baseModel from './models/base'
let app;
let store;
let dispatch;
const createApp = (opts) => {
  app = create(opts);
  app.use(createLoading({}));
  if(!global.registered){
    // 只挂载一次model
    opts.models.forEach(model => app.model(model));
  }
  global.registered = true;
  app.start();
  store = app._store;
  app.getStore = () => store;
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