import React from 'react'
import ReactDOM from 'react-dom'

const App = ({title}) => (
  <div>
    <h2>{title}</h2>
  </div>
)

ReactDOM.render(
  <App/>, document.getElementById('root')
)
