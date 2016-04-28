import React from 'react'

import Layout from './layout'
import {Row, Column, Item} from './layout/items'
import {Sizing, Timer, DebugWrapper} from './demoItems'

const layoutRegister = {
  wrappers: {
    debug: DebugWrapper,
  },
  size: Sizing,
  time: Timer,
}

export default React.createClass({
  render() {
    return (
      <div style={style.app}>
        <Layout register={layoutRegister}>
          <Column id='sidebar' relativeScale={0.2}>
            <Item id='one' component='size' />
          </Column>
          <Column id='main'>
            <Row id='top' relativeScale={0.2}>
              <Item id='one' component='size' />
              <Item id='two' component='size' />
            </Row>
            <Row id='bottom'>
              <Item id='one' component='size' />
            </Row>
          </Column>
        </Layout>
      </div>
    )
  }
})

const style = {
  app: {
    width: '100%',
    position: 'relative',
    float: 'left',
    fontFamily: 'Open Sans',
  },
}
