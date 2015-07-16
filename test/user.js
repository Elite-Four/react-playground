var fs = require('fs')
var path = require('path')

require('should')
var async = require('async')
var rimraf = require('rimraf')

var Code = require('../app/models/Code')

describe('User', function () {
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')
  var dummyCode = new Code('-*- dummyCode -*-', dummyUser.user)

  before(function (done) {
    dummyCode.setContent('', done)
  })

  it('should be able to catch user info include code list', function (done) {
    async.waterfall([
      function (next) {
        request.get({
          url: dummyUser.user.toURL(),
          json: true
        }, next)
      },
      async.asyncify(function (response, body) {
        body.should.eql({ codes: [ dummyCode.toString() ] })
      })
    ], done)
  })

  after(function (done) {
    async.waterfall([
      function (next) {
        dummyUser.user.getRoot(next)
      },
      rimraf
    ], done)
  })
})
