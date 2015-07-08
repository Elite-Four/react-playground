module.exports = function (req, res) {
  req.session = null
  res.redirect('/')
}