import React from 'react'

class LayoutWrapper extends React.Component {
  render() {
    let {style, children} = this.props
    style = {
      overflow: 'hidden',
      ...style,
    }
    return <div style={style}>{children}</div>
  }
}

export class LayoutParent extends React.Component {
  static propTypes = {
    type: React.PropTypes.oneOf(['row', 'column']).isRequired
  };

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
}

export class LayoutItem extends React.Component {
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
}

export class NotFoundInRegister extends React.Component {
  render() {
    const {meta} = this.props
    const {width, height} = meta
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div style={{width, height, fontSize: 16, overflow: 'scroll'}}>
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
}
