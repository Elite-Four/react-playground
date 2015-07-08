module.exports = function (req, res) {
  res.type('html')
  if (req.user) {
    res.end('Logged in:<pre>' + JSON.stringify(req.user) + '</pre> <a href="/logout">Logout</a>')
  } else {
    res.end('<a href="/login">Login</a>')
  }
}