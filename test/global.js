var server

before(function (done) {
  // Mock
  require('./helpers/dummyUser')

  var app = require('../app')
  var request = require('./helpers/request')
  server = app.listen(request.port, done)
})

after(function (done) {
  server.close(done)
})
