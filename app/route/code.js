var Buffer = require('buffer').Buffer
var fs = require('fs')
var path = require('path')
var github = require('../github')

var basedir = path.join(__dirname, '../../codes/')

exports.param = {
  user: function (req, res, next, user) {
    github.getUserId(user, function (err, id) {
      if (err)
        return next(err)
      req.params.id = id
      next()
    })
  },
  code: function (req, res, next, code) {
    if (req.params.id == null)
      return next(new Error('No user id.'))
    
    var codeFilename = new Buffer(code).toString('hex')
    req.params.pathname = path.join(basedir,
      req.params.id.toString(), codeFilename)
    
    return next()
  }
}

exports.get = function (req, res) {
  var pathname = req.params.pathname
  
  if (pathname == null) {
    res.statusCode = 404
    return res.end()
  }
  
  var stat = fs.stat(pathname, function (err, stat) {
    if (err) {
      if (err.code == 'ENOENT') {
        res.statusCode = 404
        return res.end()
      }
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
    } catch (e) {
      return next(err)
    }
  })
}

exports.post = function (req, res) {
  var pathname = req.params.pathname
  
  if (pathname == null) {
    res.statusCode = 400
    return res.end()
  }

  if (req.user == null ||
    req.user.id != req.params.id) {
    res.statusCode = 401
    return res.end()
  }

  var writer = fs.writeFile(pathname, req.body, function (err) {
    if (err)
      return next(err)
    
    res.statusCode = 201
    return res.end()
  })
}