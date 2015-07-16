var fs = require('fs')
var path = require('path')

var async = require('async')
var bodyParser = require('body-parser')
var mkdirp = require('mkdirp')

var router = require('./')

var Code = require('../models/Code')

require('./auth')

router.use(bodyParser.text({
  type: 'jsx'
}))

router.param('code',
  function (req, res, next, code) {
    res.locals.code = new Code(code,
      res.locals.user, req.query.preview == '✓')

    next()
  })

router.route('/@:user/:code.jsx')

  .get(function (req, res, next) {
    var code = res.locals.code
    res.type('jsx')
    async.waterfall([
      code.getFilename.bind(code),
      res.sendFile.bind(res)
    ], next)
  })

  .post(function (req, res, next) {
    if (!req.is('jsx'))
      return res.sendStatus(406).end()

    if (req.user == null || !req.user.is(res.locals.user))
      return res.sendStatus(401).end()

    async.waterfall([
      function (next) {
        res.locals.code.setContent(req.body, next)
      },
      function (next) {
        res.sendStatus(201).end()
      }
    ], next)
  })
