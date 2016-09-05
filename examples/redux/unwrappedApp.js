import React from 'react'

import {connect} from 'react-redux'

import Layout from 'react-workspace'
import {Sizing, Timer, DebugWrapper, DebugInfo} from '../demoItems'
import LayoutSummary from './layoutSummary'

import state from 'react-workspace/selectors'

class UnwrappedApp extends React.Component {
  render() {
    const register = {
      wrappers: { debug: DebugWrapper },
      default: DebugInfo,
      size: Sizing,
      time: Timer,
      summary: LayoutSummary,
    }
    const style = {
      width: '100%',
      position: 'relative',
      float: 'left',
      fontFamily: 'Open Sans',
    }
    return (
      <div style={style}>
        <Layout register={register} itemWrapper="debug" config={this.props.config} />
      </div>
    )
  }
}

export default connect(state)(UnwrappedApp)
