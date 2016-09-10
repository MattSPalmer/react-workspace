import React from 'react'
import {connect} from 'react-redux'
import state from 'react-workspace/selectors'

const LayoutSummary = props => (
  <div>
    <h1>Hello world!</h1>
    <div>
      <pre>{JSON.stringify(props.config, null, 2)}</pre>
    </div>
  </div>
)

LayoutSummary.propTypes = {
  config: React.PropTypes.object,
}

export default connect(state)(LayoutSummary)
