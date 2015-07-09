exports.login = function (req, res) {
  res.redirect('/')
}

exports.logout = function (req, res) {
  req.session = null
  res.redirect('/')
}