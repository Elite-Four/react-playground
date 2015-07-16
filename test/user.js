var fs = require('fs')
var path = require('path')

require('should')
var async = require('async')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

var codeToFile = require('../app/router/code/converter').codeToFile

var root = require('config').get('code.root')

describe('User', function () {
  var codename = '-*- dummyCode -*-'
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')
  var pathname = path.join(root, dummyUser.id.toString(), 'component', codeToFile(codename))

  before(function (done) {
    async.waterfall([
      function (next) {
        mkdirp(path.dirname(pathname), next)
      },
      function (made, next) {
        fs.writeFile(pathname, '', next)
      }
    ], done)
  })

  it('should be able to catch user info include code list', function (done) {
    async.waterfall([
      function (next) {
        request.get({
          url: '/@' + dummyUser.username,
          json: true
        }, next)
      },
      function (response, body, next) {
        body.should.eql({ codes: [ codename ] })
        next()
      }
    ], done)
  })

  after(function (done) {
    rimraf(path.dirname(pathname), done)
  })
})
