var express = require('express')
var morgan = require('morgan')
var jade = require('jade')

app = express()

app.enable('case sensitive routing')
app.enable('strict routing')

app.engine('jade', jade.__express)
app.set('view engine', 'jade')

app.use(morgan('dev'))

app.use('/static', express.static('static', {
  index: false
}))

require('./route')(app)

module.exports = app