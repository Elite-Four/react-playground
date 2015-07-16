var fs = require('fs')
var path = require('path')

var async = require('async')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

var codeToFile = require('../app/router/code/converter').codeToFile

var root = require('config').get('code.root')

describe('Code', function () {
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')

  var codename = '-*- dummyCode -*-'
  var pathname = path.join(root, dummyUser.id.toString())

  ;['component', 'preview'].forEach(function (type) {
    var codecontent = '\0\0 dummyContent \x01\x02\x03\x04' + type
    var codepathname = path.join(pathname, type, codeToFile(codename))
    var codeurl = '/@' + dummyUser.username + '/' + codename + '.jsx'

    if (type == 'preview')
      codeurl += '?preview=' + encodeURIComponent('✓')

    describe(type + ' code', function () {

      it('should get code content', function (done) {
        async.waterfall([
          function (next) {
            mkdirp(path.dirname(codepathname), next)
          },
          function (made, next) {
            fs.writeFile(codepathname, codecontent, next)
          },
          function (next) {
            request.get({
              url: codeurl,
              headers: { 'Accept': 'text/jsx' }
            }, next)
          },
          function (response, body, next) {
            body.should.eql(codecontent)
            rimraf(codepathname, next)
          }
        ], done)
      })

      it('should not post other user\'s code content', function (done) {
        async.waterfall([
          function (next) {
            request.post({
              url: codeurl,
              headers: { 'Content-Type': 'text/jsx' },
              body: codecontent
            }, next)
          },
          function (response, body, next) {
            response.statusCode.should.equal(401)
            rimraf(codepathname, next)
          }
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
              url: codeurl,
              headers: { 'Content-Type': 'text/jsx' },
              body: codecontent,
              jar: jar
            }, next)
          },
          function (response, body, next) {
            response.statusCode.should.equal(201)
            fs.readFile(codepathname, { encoding: 'utf8' }, next)
          },
          function (data, next) {
            data.should.equal(codecontent)
            rimraf(codepathname, next)
          }
        ], done)
      })
    })
  })
})
