var Buffer = require('buffer').Buffer
var fs = require('fs')
var path = require('path')

var bodyParser = require('body-parser')
var mkdirp = require('mkdirp')

var router = require('./')

require('./auth')

router.use(bodyParser.text({
  type: 'jsx'
}))

router.param('code',
  function (req, res, next, code) {
    var codeFilename = new Buffer(code).toString('hex')

    if (req.query.preview == '✓')
      res.locals.pathname = path.join(res.locals.pathname, 'preview', codeFilename)
    else
      res.locals.pathname = path.join(res.locals.pathname, 'component', codeFilename)
    return next()
  })

router.route('/@:user/:code.jsx')

  .get(function (req, res) {
    var pathname = res.locals.pathname

    if (pathname == null)
      return next(new Error('No code name.'))

    res.type('jsx').sendFile(pathname, function (err) {
      if (err)
        return res.sendStatus(err.status).end()
    })
  })

  .post(function (req, res) {
    var pathname = res.locals.pathname

    if (pathname == null)
      return next(new Error('No code name.'))

    if (!req.is('jsx'))
      return res.sendStatus(406).end()

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
