var fs = require('fs')
var path = require('path')
var format = require('util').format

var async = require('async')
var mkdirp = require('mkdirp')

var getUserId = require('./github').getUserId

var root = require('config').get('code.root')

module.exports = function User(name) {

  if (!(this instanceof User))
    return new User(name)

  Object.defineProperty(this, 'name', {
    value: name.toString()
  })
}

User.prototype.getRoot = function (callback) {
  var user = this
  async.waterfall([
    getUserId.bind(user.name),
    async.asyncify(function (id) {
      return path.join(root, id.toString())
    })
  ], callback)
}

User.prototype.getCodes = function (callback) {
  var Code = require('Code')

  var user = this
  async.waterfall([
    user.getRoot.bind(user),
    async.asyncify(function (root) {
      return path.join(root, 'component')
    }),
    function (path, next) {
      async.waterfall([
        mkdirp.bind(this, path),
        fs.readdir.bind(fs, path)
      ], next)
    },
    async.asyncify(function (files) {
      return files.map(Code.fromFilename.bind(Code, user))
    })
  ], callback)
}

User.prototype.toURL = function () {
  return format('/@%s', encodeURIComponent(this))
}

User.prototype.is = function (that) {
  return this.name === that.name && this.user.is(that.user)
}

User.prototype.toString = function() {
  return this.name
}
