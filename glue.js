var config = {analyzerPort:8079,
              backendPort:8082,
              apiPort:8081,
              refactorPort:8078,
              gluePort:8080,
              neo4jPort:7474}

var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')

// Define HTTP proxies to your custom API backend

var app = express()

app.use(
  '/api',
  proxyMiddleware({ target: 'http://localhost:' + config.apiPort, changeOrigin: true })
);
app.use(
  '/analyze',
  proxyMiddleware({ target: 'http://localhost:' + config.analyzerPort, changeOrigin: true })
);
app.use(
  '/refactor',
  proxyMiddleware({ target: 'http://localhost:' + config.refactorPort, changeOrigin: true })
);
app.use(
  '/browser',
  proxyMiddleware({ target: 'http://localhost:' + config.neo4jPort, changeOrigin: true })
);
app.use(
  ['/', '!/api', "!/analyze", "!/refactor","!/browser"],
  proxyMiddleware({ target: 'http://localhost:' + config.backendPort, changeOrigin: false })
);



// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

var uri = 'http://localhost:' + config.gluePort

module.exports = app.listen(config.gluePort, function (err) {
  if (err) {
    console.log(err)
    return
  }

})
