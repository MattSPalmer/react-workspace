import React from 'react'
import {findDOMNode} from 'react-dom'
import {get, omit, debounce} from 'lodash'
import {LayoutParent, LayoutItem, NotFoundInRegister} from './renderedItems'
import {walkConfig} from './utility'

class Layout extends React.Component {
  static defaultProps = {
    notFound: NotFoundInRegister,
    itemWrapper: 'div'
  };

  state = {
    parentDim: {w: 0, h: 0}
  };

  componentWillMount() {
    this.setState({config: this.props.config || this.createConfig()})
  }

  componentDidMount() {
    const handleResize = debounce(this.updateDimensions, 100)
    window.addEventListener('resize', handleResize)
    this.updateDimensions()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      config: nextProps.config || this.createConfig(nextProps)
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  updateDimensions = () => {
    const elem = findDOMNode(this)
    const {offsetWidth, offsetHeight} = elem
    this.setState({
      parentDim: {w: offsetWidth, h: offsetHeight}
    })
  };

  createConfig = (props = this.props) => {
    const content = React.Children.map(props.children, c => {
      if (!c.type.createConfig) {
        return null
      }
      return c.type.createConfig(c)
    })
    return {content, dim: {w: 1, h: 1}}
  };

  walkConfig = () => {
    const {config} = this.state
    return walkConfig(config)
  };

  renderLayoutChild = (child) => {
    const {register, itemWrapper, notFound} = this.props
    const key = child.id
    const {w, h} = this.state.parentDim
    const {dim} = child
    const [width, height] = [dim.w * w, dim.h * h].map(Math.floor)
    const reshapedProps = {
      ...child.innerProps,
      ...omit(child, 'innerProps'),
    }
    let commonProps = {key, width, height}
    if (child.type === 'item') {
      commonProps = {
        ...commonProps,
        componentClass: get(register, child.component, notFound),
        wrapper: get(register, itemWrapper, itemWrapper)
      }
      return <LayoutItem {...reshapedProps} {...commonProps} />
    }
    return (
      <LayoutParent {...child} {...commonProps}>
        {child.content && child.content.map(this.renderLayoutChild)}
      </LayoutParent>
    )
  };

  renderLayout = () => {
    const config = this.walkConfig()
    if (!config.content) return <div style={{display: 'flex'}} />
    return (
      <div style={{display: 'flex'}}>
        {config.content.map(this.renderLayoutChild)}
      </div>
    )
  };

  render() {
    return (
      <div>
        <div style={{width: '100%', height: '100%'}}>
          {this.renderLayout()}
        </div>
      </div>
    )
  }
}

const componentLike = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.func,
  React.PropTypes.instanceOf(React.Component),
])

Layout.propTypes = {
  register: React.PropTypes.object,
  config: React.PropTypes.object,
  itemWrapper: componentLike,
  notFound: componentLike,
}

export default Layout
