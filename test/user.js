var fs = require('fs')
var path = require('path')

require('should')
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
    mkdirp(path.dirname(pathname), function (err) {
      if (err) return done(err)

      fs.writeFile(pathname, '', done)
    console.log(pathname)
    })
  })

  it('should be able to catch user info include code list', function (done) {
    request.get({
      url: '/@' + dummyUser.username,
      json: true
    }, function (err, response, body) {
      if (err) return done(err)
      body.should.eql({ codes: [ codename ] })
      done()
    })
  })

  after(function (done) {
    rimraf(path.dirname(pathname), done)
  })
})
