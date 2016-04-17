import React from 'react'
import {findDOMNode} from 'react-dom'
import {debounce} from 'lodash'
import Pane from './pane'
import {walkConfig} from './utility'

const Layout = React.createClass({
  getInitialState() {
    return {}
  },
  renderItem() {

  },
  renderItems() {
    console.log(
      JSON.stringify(this.walkConfig(), null, 2)
    )
  },
  walkConfig() {
    const {config} = this.state
    return walkConfig(config)
  },
  createConfig(props = this.props) {
    const content = React.Children.map(props.children, c => {
      if (c.type.createConfig)
        return c.type.createConfig(c)
    })
    return {content}
  },
  updateDimensions() {
    const elem = findDOMNode(this)
    const {offsetWidth, offsetHeight} = elem
    this.setState({parentDim: {w: offsetWidth, h: offsetHeight}})
  },
  handleResize() {
    return debounce(this.updateDimensions, 50)()
  },
  componentWillMount() {
    this.setState({config: this.createConfig()})
  },
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.updateDimensions()
  },
  componentWillReceiveProps(nextProps) {
    this.setState({config: this.createConfig(nextProps)})
  },
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  render() {
    return (
      <div>
        <div style={{width: '100%', height: '100%'}}>
          {this.renderItems()}
        </div>
      </div>
    )
  }
})

export default Layout
