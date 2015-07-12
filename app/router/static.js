var path = require('path')

var express = require('express')

var router = require('./')

router.use('/static', express.static(
  path.join(__dirname, '../../static'),
  { index: false }))
