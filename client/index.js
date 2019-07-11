import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import {ApolloProvider} from 'react-apollo'
import ApolloClient from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import 'semantic-ui-css/semantic.js'
import {toast} from 'react-toastify'
toast.configure()

// establishes socket connection
import './socket'

// apollo client setup
// const link = new HttpLink({uri: 'http://localhost:8080/graphql'})
const link = new HttpLink({
  uri: 'https://graphql-fruit-shopper.herokuapp.com/graphql'
})
const cache = new InMemoryCache()
export const client = new ApolloClient({
  link,
  cache
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>,
  document.getElementById('app')
)
