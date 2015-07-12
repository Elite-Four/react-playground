var express = require('express')
var morgan = require('morgan')
var errorhandler = require('errorhandler')

var app = module.exports = express()

if (process.env.NODE_ENV != 'production') {
  app.use(morgan('dev'))
  app.use(errorhandler())
} else {
  app.use(morgan())
}

app.use(require('./router'))
