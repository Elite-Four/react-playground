var fs = require('fs')
var path = require('path')

var mkdirp = require('mkdirp')
var config = require('config')

var fileToCode = require('../code/converter').fileToCode
var getUserId = require('./github').getUserId

var router = require('../')

var User = require('../../models/User')
var Code = require('../../models/Code')

var ROOT = config.get('code.root')

router.param('user',
  function (req, res, next, user) {
    res.locals.user = new User(user)
  })

router.get('/@:user', function (req, res, next) {
  switch (req.accepts(['json', 'html'])) {
    case 'json':
      res.locals.user.getCodes(function (err, codes) {
        if (err) return next(err)

        res.json({
          codes: codes.map(Code.prototype.toString)
        })
      })
      break
    case 'html':
      res.type('html')
      res.end('Hello, id: ' + res.locals.id)
      break
    default:
      res.sendStatus(406).end()
  }
})
