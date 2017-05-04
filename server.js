'use strict'

import express from 'express'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from './shared/routes'
import * as reducers from './shared/reducers'
import fetch from 'isomorphic-fetch'
import bodyParser from 'body-parser'

import expressGraphQL from 'express-graphql'
import schema from './schema/schema'

require('dotenv').config()

const app = express()
app.use(bodyParser.json())

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.use([
    '/api/items',
    '/api/legal_entities',
    '/api/transactions',
    '/api/batch_transactions',
    '/api/marketplaces',
    '/api/fees'
  ], (req, res) => {
  let opts = {
    url: process.env.URL + req.originalUrl.replace('api/', ''),
    method: 'GET',
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Authorization': process.env.AUTH
    },
    body: null
  }
  fetch(opts.url, opts)
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.status(200).end(JSON.stringify(response))
    })
})

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackConfig = require('./webpack.config.js')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  app.use(webpackDevMiddleware(webpack(webpackConfig)));
  app.use(webpackHotMiddleware(webpack(webpackConfig)));
} else {
  app.use(express.static('dist'));
}

app.use('/', (req, res) => {
  const reducer = combineReducers(reducers)
  const store = createStore(reducer)

  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      console.log(err)
      return res.status(500).end('Internal server error.')
    }

    if (!renderProps) return res.status(404).end('Not found.')

    const componentHTML = renderToString((
      <Provider store={ store }>
        <RouterContext {...renderProps} />
      </Provider>
    ))

    const initialState = store.getState()

    const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thawing Garden 52500</title>
        </head>
        <body>
          <div id="app"><div>${componentHTML}</div></div>
          <script type="application/javascript" src="/manifest.js"></script>
          <script type="application/javascript" src="/vendor.js"></script>
          <script type="application/javascript" src="/bundle.js"></script>
          <script type="application/javascript">
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          </script>
        </body>
      </html>
    `

    res.end(HTML)
  })
})

export default app
