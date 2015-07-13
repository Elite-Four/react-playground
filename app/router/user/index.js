var fs = require('fs')
var path = require('path')

var config = require('config')

var getUserId = require('./github').getUserId

var router = require('../')

var ROOT = config.get('root')

if (ROOT[0] == '.') // relative path
  ROOT = path.join(path.dirname(require.main.filename), ROOT)

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
  if (req.accepts('json')) {
    fs.readDir(res.locals.pathname, function (err, files) {
      if (err)
        return next(err)

      res.json({
        codes: files.filter(function (file) {
          return file.indexOf('.') == -1
        })
      })
    })
  } else if (req.accepts('html')) {
    res.type('html')
    res.end('Hello, id: ' + res.locals.id)
  } else {
    res.sendStatus(406).end()
  }
})
