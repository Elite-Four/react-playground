var Router = require('express').Router

var router = module.exports = Router({
  caseSensitive: true,
  strict: true
})

require('./static')
require('./auth')
require('./user')
require('./code')
