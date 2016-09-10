import React from 'react'

import {connect} from 'react-redux'

import Layout from 'react-workspace'
import state from 'react-workspace/selectors'

import {Sizing, Timer, DebugWrapper, DebugInfo} from '../demoItems'
import LayoutSummary from './layoutSummary'


const UnwrappedApp = props => {
  const register = {
    wrappers: {debug: DebugWrapper},
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
      <Layout register={register} itemWrapper="debug" config={props.config} />
    </div>
  )
}

UnwrappedApp.propTypes = {
  config: React.PropTypes.object,
}

export default connect(state)(UnwrappedApp)
