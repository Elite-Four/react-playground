var path = require('path')

var rimraf = require('rimraf')

var dummyUser = require('./helpers/dummyUser')
var request = require('./helpers/request')
var server

var root = require('config').get('code.root')

before(function (done) {
  var app = require('../app')
  server = app.listen(request.port, done)
})

after(function (done) {
  rimraf(path.join(root, dummyUser.id.toString()), function (err) {
    if (err) return done(err)
    server.close(done)
  })
})
