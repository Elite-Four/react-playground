var express = require('express')
var morgan = require('morgan')

app = express()

app.enable('case sensitive routing')
app.enable('strict routing')

app.use(morgan('dev'))

app.use('/static', express.static('static', {
  index: false
}))

require('./route')(app)

module.exports = app