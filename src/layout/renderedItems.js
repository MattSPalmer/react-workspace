import React from 'react'

const LayoutWrapper = React.createClass({
  render() {
    let {style, children} = this.props
    style = {
      overflow: 'hidden',
      ...style,
    }
    return <div style={style}>{children}</div>
  }
})

export const LayoutParent = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['row', 'column']).isRequired
  },
  render() {
    const {children, type} = this.props
    const layoutStyle = {
      display: 'flex',
      flexDirection: type,
      flexWrap: 'nowrap',
      flexBasis: 'fit-content',
    }
    return (
      <LayoutWrapper style={{...layoutStyle}}>
        {children}
      </LayoutWrapper>
    )
  }
})

export const LayoutItem = React.createClass({
  render() {
    const Comp = this.props.componentClass
    const Wrapper = this.props.wrapper
    const {width, height} = this.props
    const style = {
      width, height,
      flexGrow: 1,
    }
    return (
      <LayoutWrapper style={style}>
        <Wrapper {...this.props}>
          <Comp {...this.props.innerProps} meta={this.props}/>
        </Wrapper>
      </LayoutWrapper>
    )
  }
})

export const NotFoundInRegister = React.createClass({
  render() {
    const {meta} = this.props
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div style={{fontSize: 16}}>
          <h1>Component '{meta.component}' not found...</h1>
          <div>
            <span>Here's what we know:</span>
            <pre style={{margin: 0}}>
              {JSON.stringify(this.props, null, 2)}
            </pre>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <pre>There was a problem loading this frame.</pre>
        </div>
      )
    }
  }
})
