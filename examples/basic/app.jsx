import React from 'react'
import ReactDOM from 'react-dom'

import Layout from 'react-workspace'
import {Row, Column, Item} from 'react-workspace/items'
import {Sizing, Timer, DebugWrapper} from '../demoItems'

const App = () => {
  const register = {
    wrappers: {debug: DebugWrapper},
    size: Sizing,
    time: Timer,
  }
  const style = {
    width: '100%',
    position: 'relative',
    float: 'left',
    fontFamily: 'Open Sans',
  }
  return (
    <div style={style}>
      <Layout register={register}>
        <Column id="sidebar" relativeScale={0.2}>
          <Item id="one" component="size" />
        </Column>
        <Column id="main">
          <Row id="top" relativeScale={0.2}>
            <Item id="one" component="size" />
            <Item id="two" component="size" />
          </Row>
          <Row id="bottom">
            <Item id="one" component="size" />
          </Row>
        </Column>
      </Layout>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

