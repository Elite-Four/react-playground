var Buffer = require('buffer').Buffer
var fs = require('fs')
var path = require('path')
var format = require('util').format

var async = require('async')

module.exports = function Code(name, user, isPreview) {
  var User = require('./User')

  if (!(this instanceof Code))
    return new Code(user, name)

  Object.defineProperties(this, {
    name: { value: name.toString() },
    user: { value: (user instanceof User) ? user : new User(user) },
    isPreview: !!isPreview
  })
}

Code.fromFilename = function (filename, user, isPreview) {
  return new Code(new Buffer(filename, 'hex'),
    user, isPreview)
}

Code.prototype.getFilename = function (callback) {
  var code = this
  async.waterfall([
    code.user.getRoot.bind(code.user),
    async.asyncify(function (userRoot) {
      return path.join(userPath,
        code.isPreview ? 'preview' : 'component',
        new Buffer(code.name).toString('hex'))
    })
  ], callback)
}

Code.prototype.getContent = function (callback) {
  var code = this
  async.waterfall([
    code.getFilename.bind(code),
    function (filename, next) {
      fs.readFile(filename, { encoding: 'utf8' }, next)
    }
  ], callback)
}

Code.prototype.setContent = function (content, callback) {
  var code = this
  async.waterfall([
    code.getFilename.bind(code),
    function (filename, next) {
      fs.writeFile(filename, content, next)
    }
  ], callback)
}

Code.prototype.toURL = function () {
  return format('%s/%s.jsx%s',
    this.user.toURL(),
    encodeURIComponent(this),
    this.isPreview ? encodeURIComponent('?preview=✓') : '')
}

Code.prototype.is = function (that) {
  return this.name === that.name && this.user.is(that.user)
}

Code.prototype.toString = function() {
  return this.name
}
