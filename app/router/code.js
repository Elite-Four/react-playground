var Buffer = require('buffer').Buffer
var fs = require('fs')
var path = require('path')

var bodyParser = require('body-parser')
var GitHub = require('github')
var mkdirp = require('mkdirp')

var config = require('./code.json')

var router = require('./')

var ROOT = path.join(__dirname, config.root)

require('./auth')

var getUserId = function (github) {
  return function (user, callback) {
    github.user.getFrom({
        user: user
      }, function (err, res) {
        console.log(res)
        return callback(err, res.id)
      })
  }
} (new GitHub({
    version: "3.0.0",
    debug: true,
    headers: {
      "user-agent": "react-playground"
    }
  }))

router.use(bodyParser.text())

router.param('user',
  function (req, res, next, user) {
    getUserId(user, function (err, id) {
      if (err)
        return next(err)

      res.locals.id = id
      next()
    })
  })

router.param('code',
  function (req, res, next, code) {
    if (res.locals.id == null)
      return next(new Error('No user id.'))

    var codeFilename = new Buffer(code).toString('hex')
    if (req.query.preview == '✓') {
      codeFilename += '.preview'
    }

    res.locals.pathname = path.join(
      ROOT,
      res.locals.id.toString(),
      codeFilename)

    return next()
  })

var route = router.route('/@:user/:code.jsx')

route.get(function (req, res) {
  var pathname = res.locals.pathname

  if (pathname == null)
    return next(new Error('No code name.'))

  var stat = fs.stat(pathname, function (err, stat) {
    if (err) {
      if (err.code == 'ENOENT')
        return res.sendStatus(404).end()
      else
        return next(err)
    }

    if (!stat.isFile())
      return next(new Error('Invalid file'))

    try {
      var reader = fs.createReadStream(pathname)
      res.writeHead(200, {
        'Content-Type': 'text/jsx',
        'Content-Length': stat.size
      })
      reader.pipe(res)
    } catch (err) {
      return next(err)
    }
  })
})

route.post(function (req, res) {
  var pathname = res.locals.pathname

  if (pathname == null)
    return next(new Error('No code name.'))

  if (req.user == null || req.user.id != res.locals.id)
    return res.sendStatus(401).end()

  mkdirp(path.dirname(pathname), function (err) {
    if (err)
      return next(err)

    fs.writeFile(pathname, req.body, function (err) {
      if (err)
        return next(err)

      res.statusCode = 201
      return res.sendStatus(201).end()
    })
  })
})
