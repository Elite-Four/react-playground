var path = require('path')

var async = require('async')
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
  async.waterfall([
    function (next) {
      dummyUser.user.getRoot(next)
    },
    rimraf,
    function (next) {
      server.close(next)
    }
  ], done)
})
