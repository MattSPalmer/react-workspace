import React from 'react'

import Layout from './layout'
import {Row, Column, Item} from './layout/items'
import Pane from './layout/pane'

const Box = ({color = 'black', meta}) => (
  <div style={{padding: 10, width: '100%', height: '100%'}}>
    <div>
      <h2 style={{margin: 0}}>
        {meta.width} x {meta.height}
      </h2>
      <pre style={{margin: 0}}>
        {JSON.stringify(meta, null, 2)}
      </pre>
    </div>
  </div>
)

const Sizing = React.createClass({
  coloredDim(dim, threshold = 1000) {
    const style = {
      color: dim > threshold ? '#F99' : 'unset'
    }
    return <span style={style}>{dim}</span>
  },
  render() {
    const {meta} = this.props
    const wrapStyle = {
      width: '100%', height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
    const headerStyle = {
      color: '#CCC', fontSize: meta.width / 7,
      margin: 0, display: 'inline-block',
    }
    return (
      <div style={wrapStyle}>
        <h1 style={headerStyle}>
          {this.coloredDim(meta.width)} x {this.coloredDim(meta.height)}
        </h1>
      </div>
    )
  }
})

const Timer = React.createClass({
  getInitialState() {
    return {time: 0}
  },
  componentDidMount() {
    const fn = () => this.setState({time: this.state.time + 1})
    this.setState({
      timerId: window.setInterval(fn, 1000)
    })
  },
  componentWillUnmount() {
    window.clearInterval(this.state.timerId)
  },
  handleClick(e) {
    this.setState({time: 0})
  },
  formattedTime() {
    const {time} = this.state
    const zeroPad = (input, length = 2) => {
      input = "" + input
      let paddingSize = Math.max(0, length - input.length)
      return new Array(paddingSize > 0 ? paddingSize + 1 : 0).join("0") + input;
    }
    const [min, sec] = [Math.floor(time / 60), time % 60]
    return `${zeroPad(min)}:${zeroPad(sec)}`
  },
  render() {
    const {meta} = this.props
    const wrapStyle = {
      width: '100%', height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
    const headerStyle = {
      color: this.props.color || 'black', fontSize: meta.width / 3,
      margin: 0, display: 'inline-block',
    }
    return (
      <div style={wrapStyle}>
        <h2 style={headerStyle} onClick={this.handleClick}>{this.formattedTime()}</h2>
      </div>
    )
  }
})

const thing = (
  <Column>
    <Row>
      <Item component='size' />
      <Item component='size' />
    </Row>
    <Item component='size' />
    <Item component='size' />
  </Column>
)

export default React.createClass({
  render() {
    const register = {
      size: Sizing, 
      time: Timer,
      debug: Box
    }
    return (
      <div style={style.app}>
        <Layout register={register} itemWrapper={Pane}>
          {thing}
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

