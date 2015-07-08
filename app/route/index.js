module.exports = function (app) {
  app.get('/', require('./home'))
  app.post('/compile', require('./compile'))
}