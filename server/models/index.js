module.exports = (app) => {
  app.use('/ads', require('./ads'))
  app.use('/city', require('./airportList'))
  app.use('/list', require('./list'))
  app.use(require('./login'))
}