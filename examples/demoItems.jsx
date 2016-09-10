import React from 'react'
import {connect} from 'react-redux'
import {omit, join} from 'lodash/fp'

import {
  itemPath as itemPathSelector,
  itemDepth as itemDepthSelector
} from 'react-workspace/selectors'

import * as actions from 'react-workspace/actions'


const mapDispatch = (dispatch, {meta}) => ({
  splitItem: (parent: Id, newItem: Item, direction): void => (
    dispatch(actions.splitItem(meta.id, parent, newItem, direction))
  )
})

class DumbDebugInfo extends React.Component {
  path = (tree = this.props.meta) => {
    if (!tree.parent) return 'layout'
    return `${this.path(tree.parent)} > ${tree.id}`
  };

  render() {
    const {meta, itemPath, itemDepth, splitItem} = this.props
    const {id} = meta
    const style = {
      overflow: 'scroll',
      padding: 10,
      width: '100%',
      height: '100%',
    }
    return (
      <div style={style}>
        <div>
          <h3 style={{margin: 0}}>
            <pre>{join(' > ', itemPath(id))} ({itemDepth(id)})</pre>
          </h3>
          <pre style={{margin: 0}}>
            {JSON.stringify(omit('parent', meta), null, 2)}
          </pre>
          <div>
            <button onClick={() => splitItem('down')}>Split</button>
          </div>
        </div>
      </div>
    )
  }
}

DumbDebugInfo.propTypes = {
  meta: React.PropTypes.object,
  itemPath: React.PropTypes.func,
  itemDepth: React.PropTypes.func,
}

export const DebugInfo = connect(state => ({
  itemPath: itemPathSelector(state),
  itemDepth: itemDepthSelector(state)
}), mapDispatch)(DumbDebugInfo)

export const Sizing = props => {
  const {meta, color = '#CCC'} = props
  const theColor = meta.width > 400 ? color : 'orange'

  const wrapStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #CCC',
    margin: '0 -1 -1 0',
  }
  const headerStyle = {
    fontSize: meta.width / 7,
    color: theColor,
    margin: 0,
  }
  return (
    <div style={wrapStyle}>
      <div>
        <h1 style={headerStyle}>{meta.width} x {meta.height}</h1>
        <span style={{fontSize: meta.width / 24, color: theColor}}>
          {meta.id} - child of {meta.parent.type} '{meta.parent.id}'. I have {meta.siblings} sibs!
        </span>
      </div>
    </div>
  )
}

Sizing.propTypes = {
  meta: React.PropTypes.object,
  color: React.PropTypes.string,
}

export class Timer extends React.Component {
  static defaultProps = {
    color: 'black',
  };

  state = {time: 0};

  componentWillMount() {
    const fn = () => this.setState({time: this.state.time + 1})
    this.setState({
      timerId: window.setInterval(fn, 1000)
    })
  }

  componentWillUnmount() {
    window.clearInterval(this.state.timerId)
  }

  handleClick = () => {
    this.setState({time: 0})
  };

  formattedTime = () => {
    const {time} = this.state
    const zeroPad = (input, length = 2) => {
      const stringInput = String(input)
      const paddingSize = Math.max(0, length - stringInput.length)
      return new Array(paddingSize > 0 ? paddingSize + 1 : 0).join('0') + stringInput
    }
    const [min, sec] = [Math.floor(time / 60), time % 60]
    return `${zeroPad(min)}:${zeroPad(sec)}`
  };

  render() {
    const {meta} = this.props
    const wrapStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
    const headerStyle = {
      color: this.props.color,
      fontSize: meta.width / 3,
      display: 'inline-block',
      margin: 0,
    }
    return (
      <div style={wrapStyle}>
        <h2 style={headerStyle}>{this.formattedTime()}</h2>
        <button onClick={this.handleClick}>reset</button>
      </div>
    )
  }
}

Timer.propTypes = {
  meta: React.PropTypes.object,
  color: React.PropTypes.object,
}

export class DebugWrapper extends React.Component {
  static defaultProps = {
    debug: false,
    innerProps: {},
  };

  state = {debug: this.props.innerProps.debug || this.props.debug};

  handleClick = () => {
    this.setState({debug: !this.state.debug})
  };

  toggleButton = () => {
    const style = {
      position: 'absolute',
      top: 5,
      right: 5,
      boxSizing: 'border-box',
      border: '2px solid black',
      background: 'orange',
      fontSize: 10,
      padding: 4,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      cursor: 'pointer',
      WebkitUserSelect: 'none',
    }
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    return <div onClick={this.handleClick} style={style}>debug</div>
  };

  render() {
    const {debug} = this.state
    const style = {
      position: 'relative',
      overflow: 'scroll',
      margin: '0 -1 -1 0',
      border: '1px solid black',
    }
    const sansKids = omit('children', this.props)
    return (
      <div style={style} {...sansKids}>
        {this.toggleButton()}
        <div style={{display: debug ? 'initial' : 'none'}}>
          <DebugInfo meta={sansKids} />
        </div>
        <div style={{display: debug ? 'none' : 'initial'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

DebugWrapper.propTypes = {
  innerProps: React.PropTypes.object,
  debug: React.PropTypes.bool,
  children: React.PropTypes.node,
}
