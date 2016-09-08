/* eslint-disable react/require-render-return, class-methods-use-this */
import React from 'react'
import invariant from 'invariant'

export class Row extends React.Component {
  static createConfig = (elem) => ({
    type: 'row',
    id: elem.props.id,
    relativeScale: elem.props.relativeScale,
    innerProps: elem.props.innerProps || {},
    content: React.Children.map(elem.props.children, c => {
      if (!c.type.createConfig) {
        return null
      }
      return c.type.createConfig(c)
    })
  });

  render() {
    invariant(
      false,
      '<Row> elements are for Layout configuration only and should not be rendered'
    )
  }
}

export class Column extends React.Component {
  static createConfig = (elem) => ({
    type: 'column',
    id: elem.props.id,
    relativeScale: elem.props.relativeScale,
    innerProps: elem.props.innerProps || {},
    content: React.Children.map(elem.props.children, c => {
      if (!c.type.createConfig) {
        return null
      }
      return c.type.createConfig(c)
    })
  });

  render() {
    invariant(
      false,
      '<Column> elements are for Layout configuration only and should not be rendered'
    )
  }
}

export class Item extends React.Component {
  static createConfig = (elem) => ({
    type: 'item',
    id: elem.props.id,
    relativeScale: elem.props.relativeScale,
    component: elem.props.component,
    title: elem.props.title,
    innerProps: elem.props.innerProps || {},
  });

  render() {
    invariant(
      false,
      '<Item> elements are for Layout configuration only and should not be rendered'
    )
  }
}

