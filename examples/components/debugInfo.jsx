
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

type DebugProps = {
  meta: KeyMap<any>,
  itemPath: (id: Id) => Id[],
  itemDepth: (id: Id) => number,
  splitItem: (parent: Id, newItem: Item, direction?: string) => void
}

const DebugInfo = (props: DebugProps) => {
  const {meta, itemPath, itemDepth, splitItem} = props
  const {id} = meta
  const style = {overflow: 'scroll', padding: 10, width: '100%', height: '100%'}
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
          <button onClick={() => splitItem('down', {id: 'foobar', component: 'size'})}>
            Split
          </button>
        </div>
      </div>
    </div>
  )
}

DebugInfo.propTypes = {
  meta: React.PropTypes.object,
  itemPath: React.PropTypes.func,
  itemDepth: React.PropTypes.func,
  splitItem: React.PropTypes.func,
}

export default connect(state => ({
  itemPath: itemPathSelector(state),
  itemDepth: itemDepthSelector(state)
}), mapDispatch)(DebugInfo)


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
