var Buffer = require('buffer').Buffer
var fs = require('fs')
var path = require('path')

var mkdirp = require('mkdirp')
var config = require('config')

var getUserId = require('./github').getUserId

var router = require('../')

var ROOT = config.get('code.root')

router.param('user',
  function (req, res, next, user) {
    getUserId(user, function (err, id) {
      if (err)
        return next(err)

      res.locals.id = id
      res.locals.pathname = path.join(ROOT, id.toString())

      return next()
    })
  })

router.get('/@:user', function (req, res, next) {
  switch (req.accepts(['json', 'html'])) {
    case 'json':
      var componentDir = path.join(res.locals.pathname, 'component')
      mkdirp(componentDir, function (err) {
        if (err)
          return next(err)

        fs.readdir(componentDir, function (err, files) {
          if (err)
            return next(err)

          res.json({
            codes: files.map(function (file) {
              return new Buffer(file, 'hex').toString()
            })
          })
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
