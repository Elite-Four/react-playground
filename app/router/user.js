var fs = require('fs')
var path = require('path')

var GitHub = require('github')

var router = require('./')

var config = require('./user.json')

var ROOT = path.join(__dirname, config.codeRoot)

var getUserId = function (github) {
  return function (user, callback) {
    github.user.getFrom({
        user: user
      }, function (err, res) {
        return callback(err, res ? res.id : null)
      })
  }
} (new GitHub({
    version: "3.0.0",
    debug: process.env.NODE_ENV != 'production',
    headers: {
      "user-agent": "react-playground"
    }
  }))

router.param('user',
  function (req, res, next, user) {
    getUserId(user, function (err, id) {
      if (err)
        return next(err)

      res.locals.id = id
      res.locals.pathname = path.join(ROOT, id)

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