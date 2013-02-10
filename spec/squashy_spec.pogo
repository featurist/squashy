squashy = require '../src/squashy'
express = require 'express'

app = express()
app.get '/' @(req, res)
    res.send '<html>
                <head>
                    <link href="/css/head" rel="stylesheet"></link>
                    <script src="/js/head"></script>
                </head>
                <body>
                    <script src="/js/body"></script>
                    <link rel="stylesheet" href="/css/body" />
                </body>
              </html>'

app.get '/js/:name' @(req, res)
    res.send "#(req.params.name) script..."

app.get '/css/:name' @(req, res)
    res.send "#(req.params.name) css..."

describe 'squashy'

    server = nil

    before
        server := app.listen 8567
        
    after
        server.close()
    
    it 'renders a web page with scripts and css links inlined'
        squashed = squashy.squash ! "http://localhost:8567/"
        squashed.should.equal  '<html>
                                  <head>
                                      <style>head css...</style>
                                      <script>head script...</script>
                                  </head>
                                  <body>
                                      <script>body script...</script>
                                      <style>body css...</style>
                                  </body>
                                </html>'
