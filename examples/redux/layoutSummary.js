import React from 'react'
import {connect} from 'react-redux'
import state from 'react-workspace/selectors'

class LayoutSummary extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello world!</h1>
        <div>
          <pre>{JSON.stringify(this.props.config, null, 2)}</pre>
        </div>
      </div>
    )
  }
}

export default connect(state)(LayoutSummary)
