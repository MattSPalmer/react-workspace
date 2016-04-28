import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import makeStore from './makeStore'
import App from './app'

const store = makeStore()

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.getElementById('root')
)
