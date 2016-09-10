/* @flow */
import React from 'react'
import {isString} from 'lodash'

type Props = { [key: string]: any }

function LayoutWrapper(props: Props) {
  let {style} = props
  style = {
    overflow: 'hidden',
    ...style,
  }
  return <div style={style}>{props.children}</div>
}

LayoutWrapper.propTypes = {
  children: React.PropTypes.node,
  style: React.PropTypes.object,
}

export function LayoutParent(props: Props) {
  const {children, type} = props
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

LayoutParent.propTypes = {
  type: React.PropTypes.string,
  children: React.PropTypes.node,
}

const wrapperProps = (wrapper, props) => (isString(wrapper) ? {} : props)

export function LayoutItem(props: Props) {
  const Comp = props.componentClass
  const Wrapper = props.wrapper
  const {width, height} = props
  const style = {width, height, flexGrow: 1}
  return (
    <LayoutWrapper style={style}>
      <Wrapper {...wrapperProps(Wrapper, props)}>
        <Comp {...props.innerProps} meta={props} />
      </Wrapper>
    </LayoutWrapper>
  )
}

const componentLike = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.instanceOf(React.Component),
  React.PropTypes.func,
])

LayoutItem.propTypes = {
  componentClass: componentLike,
  wrapper: componentLike,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
}

export function NotFoundInRegister(props: Props) {
  const {meta} = props
  const {width, height} = meta
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div style={{width, height, fontSize: 16, overflow: 'scroll'}}>
        <h1>Component '{meta.component}' not found...</h1>
        <div>
          <span>Here's what we know:</span>
          <pre style={{margin: 0}}>
            {JSON.stringify(props, null, 2)}
          </pre>
        </div>
      </div>
    )
  }
  return (
    <div>
      <pre>There was a problem loading this frame.</pre>
    </div>
  )
}

NotFoundInRegister.propTypes = {
  meta: LayoutItem.propTypes,
}

