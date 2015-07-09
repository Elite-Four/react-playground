var express = require('express')
var morgan = require('morgan')
var errorhandler = require('errorhandler')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')

var passport = require('./passport')

app = express()

app.enable('case sensitive routing')
app.enable('strict routing')

app.use(morgan('dev'))
app.use(errorhandler())
app.use(bodyParser.text())
app.use(cookieSession({
  secret: 'hello react playground blah'
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/static', express.static('static', {
  index: false
}))

require('./route')(app)

module.exports = app