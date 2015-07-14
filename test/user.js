var Buffer = require('buffer').Buffer
var fs = require('fs')
var path = require('path')

require('should')
var mkdirp = require('mkdirp')

var root = require('config').get('code.root')

describe('User', function () {
  var codeName = '-*- dummyCode -*-'
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')
  var pathname = path.join(root, dummyUser.id.toString(), 'component')

  before(function (done) {
    mkdirp(pathname, function (err) {
      if (err) return done(err)

      pathname = path.join(pathname, new Buffer(codename).toString('hex'))
      fs.writeFile(pathname, '', done)
    })
  })

  it('should be able to catch user info include code list', function (done) {
    request.get('/@' + dummyUser.username, {
      json: true
    }, function (err, response, body) {
      if (err) return done(err)
      body.should.eql({ codes: [ codename ] })
      done()
    })
  })

  after(function (done) {
    fs.unlink(pathname, function (err) {
      if (err) return done(err)

      pathname = path.dirname(pathname)

      fs.rmdir(pathname, function (err) {
        if (err) return done(err)

        pathname = path.dirname(pathname)

        fs.rmdir(pathname, done)
      })
    })
  })
})
