import React from 'react'

class Timer extends React.Component {
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

export default Timer
