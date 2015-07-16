var fs = require('fs')
var path = require('path')

var mkdirp = require('mkdirp')

var router = require('./')

var User = require('../models/User')
var Code = require('../models/Code')

router.param('user',
  function (req, res, next, user) {
    res.locals.user = new User(user)
    next()
  })

router.get('/@:user', function (req, res, next) {
  switch (req.accepts(['json', 'html'])) {
    case 'json':
      res.locals.user.getCodes(function (err, codes) {
        if (err) return next(err)

        res.json({
          codes: codes.map(function (code) {
            return code.toString()
          })
        }).end()
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
