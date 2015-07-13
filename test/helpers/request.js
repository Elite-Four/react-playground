var url = require('url')

var request = require('request')

var PORT = 2121

module.exports = request.defaults({
  baseUrl: url.format({
    protocol: 'http',
    hostname: 'localhost',
    port: PORT
  })
})

module.exports.port = PORT
