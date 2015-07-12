var express = require('express')
var morgan = require('morgan')
var errorhandler = require('errorhandler')

var app = module.exports = express()

app.use(morgan('dev'))
app.use(errorhandler())

app.use(require('./router'))

app.use('/static', express.static('static', {
  index: false
}))
