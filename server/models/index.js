module.exports = (app) => {
  app.use('/ads', require('./ads'))
  app.use('/city', require('./airportList'))
}