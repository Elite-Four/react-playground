var express = require('express')

var router = require('./')

var root = require('config').get('static.root')

router.use('/static', express.static(
  root, { index: false }))
