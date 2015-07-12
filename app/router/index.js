var Router = require('express').Router

var router = module.exports = Router({
  caseSensitive: true,
  strict: true
})

require('./home')
require('./auth')
require('./code')
