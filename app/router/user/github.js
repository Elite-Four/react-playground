var GitHub = require('github')
var Cache = require('lru-cache')
var config = require('config')

var auth = config.get('github')

var cache = new Cache({ max: auth.cache })

var github = new GitHub({
  version: "3.0.0",
  debug: process.env.NODE_ENV != 'production',
  headers: {
    "user-agent": "react-playground"
  }
})

github.authenticate({
  type: "oauth",
  key: auth.id,
  secret: auth.secret
})

exports.getUserId = function (user, callback) {
  var userCache = cache.get(user)
  var message = { user: user }

  if (userCache != null) {
    message.headers = { 'If-None-Match': userCache.etag }
  }

  github.user.getFrom(message, function (err, res) {
    if (err)
      return callback(err)

    if (res.statusCode == 304)
      return callback(null, userCache.id)

    var userCache = {
      id: res.id,
      etag: res.meta.etag
    }
    cache.set(user, userCache)

    return callback(null, userCache.id)
  })
}
