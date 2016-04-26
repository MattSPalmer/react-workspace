import React from 'react'
import invariant from 'invariant'

export const Row = React.createClass({
  statics: {
    createConfig: (elem) => ({
      type: 'row',
      relativeScale: elem.props.relativeScale,
      content: React.Children.map(elem.props.children, c => {
        if (c.type.createConfig)
          return c.type.createConfig(c)
      })
    })
  },
  render() {
    invariant(
      false,
      '<Row> elements are for Layout configuration only and should not be rendered'
    )
  }
})

export const Column = React.createClass({
  statics: {
    createConfig: (elem) => ({
      type: 'column',
      relativeScale: elem.props.relativeScale,
      content: React.Children.map(elem.props.children, c => {
        if (c.type.createConfig)
          return c.type.createConfig(c)
      })
    })
  },
  render() {
    invariant(
      false,
      '<Column> elements are for Layout configuration only and should not be rendered'
    )
  }
})

export const Item = React.createClass({
  statics: {
    createConfig: (elem) => ({
      type: 'item',
      relativeScale: elem.props.relativeScale,
      component: elem.props.component,
      title: elem.props.title,
      innerProps: elem.props.innerProps
    })
  },
  render() {
    invariant(
      false,
      '<Item> elements are for Layout configuration only and should not be rendered'
    )
  }
})

