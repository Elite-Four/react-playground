var GitHub = require('github')

var github = new GitHub({
  version: "3.0.0",
  debug: true,
  headers: {
    "user-agent": "react-playground"
  }
})

exports.getUserId = function (user, callback) {
  github.user.getFrom({
    user: user
  }, function (err, res) {
    if (err)
      return callback(err)
    return callback(null, res.id)
  })
}