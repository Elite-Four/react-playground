var fs = require('fs')
var path = require('path')

var async = require('async')
var rimraf = require('rimraf')

var Code = require('../app/models/Code')

describe('Code', function () {
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')

  ;['component', 'preview'].forEach(function (type) {
    var dummyCode = new Code('-*- dummyCode -*-', dummyUser.user, type == 'preview')
    var codecontent = '\0\0 dummyContent \x01\x02\x03\x04' + type

    describe(type + ' code', function () {

      function clean(done) {
        async.waterfall([
          function (next) {
            dummyUser.user.getRoot(next)
          },
          rimraf
        ], done)
      }

      before(clean)
      afterEach(clean)

      it('should get code content', function (done) {
        async.waterfall([
          function (next) {
            dummyCode.setContent(codecontent, next)
          },
          function (next) {
            request.get({
              url: dummyCode.toURL(),
              headers: { 'Accept': 'text/jsx' }
            }, next)
          },
          async.asyncify(function (response, body) {
            body.should.eql(codecontent)
          })
        ], done)
      })

      it('should not post other user\'s code content', function (done) {
        async.waterfall([
          function (next) {
            request.post({
              url: dummyCode.toURL(),
              headers: { 'Content-Type': 'text/jsx' },
              body: codecontent
            }, next)
          },
          async.asyncify(function (response, body) {
            response.statusCode.should.equal(401)
          })
        ], done)
      })

      it('should post current user\'s code content', function (done) {
        var jar = request.jar()
        async.waterfall([
          function (next) {
            request.get({
              url: '/',
              jar: jar
            }, next)
          },
          function (response, body, next) {
            request.post({
              url: dummyCode.toURL(),
              headers: { 'Content-Type': 'text/jsx' },
              body: codecontent,
              jar: jar
            }, next)
          },
          function (response, body, next) {
            response.statusCode.should.equal(201)
            dummyCode.getContent(next)
          },
          async.asyncify(function (data) {
            data.should.equal(codecontent)
          })
        ], done)
      })
    })
  })
})
