import React from 'react'
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
  createConfig() {
    const content = React.Children.map(this.props.children, c => {
      if (c.type.createConfig)
        return c.type.createConfig(c)
    })
    return {content}
  },
  componentWillMount() {
    this.setState({config: this.createConfig()})
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
