/* @flow */
import React from 'react'

class TitleBar extends React.Component {
  static defaultProps = {
    title: 'Pane',
    config: {
      styleSettings: {
        width: '101%',
        fontSize: 12,
        padding: 4,
      },
      // closeable: true,
    },
  };

  closeButton = () => {
    if (!this.props.config.closeable) return null
    const {color} = this.props.config.styleSettings
    const {height} = this.props.style
    const buttonSize = height - 15
    const buttonStyle = {
      height: buttonSize,
      width: buttonSize,
      float: 'right',
      border: `1px solid ${color}`,
    }
    return <div style={{...topLevelStyle.titleButton, ...buttonStyle}} />
  };

  render() {
    const {config: {styleSettings}, title} = this.props
    return (
      <div style={{...topLevelStyle.titleBar, ...topLevelStyle.box, ...styleSettings}}>
        <span>{title}</span>
        {this.closeButton()}
      </div>
    )
  }
}

TitleBar.propTypes = {
  config: React.PropTypes.object,
  title: React.PropTypes.string,
  style: React.PropTypes.number,
}

class Pane extends React.Component {
  static defaultProps = {
    config: {titleHeight: 20}
  };

  render() {
    const {title, config, children, width, height} = this.props
    const contentHeight = height - config.titleHeight
    return (
      <div style={{...topLevelStyle.container, ...topLevelStyle.box, width, height}}>
        <TitleBar
          style={{width, height: config.titleHeight}}
          title={title}
          config={config.titleBar}
        />
        <div style={{...topLevelStyle.paneContent, width, height: contentHeight}}>
          {children}
        </div>
      </div>
    )
  }
}

Pane.propTypes = {
  title: React.PropTypes.string,
  config: React.PropTypes.object,
  children: React.PropTypes.node,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
}

export default Pane

const topLevelStyle = {
  box: {
    boxSizing: 'border-box',
  },
  container: {
    position: 'relative',
    float: 'left',
  },
  paneContent: {
    display: 'inline-block',
    overflow: 'scroll',
  },
  titleBar: {
    backgroundColor: 'black',
    color: 'white',
    textTransform: 'uppercase',
  },
  titleButton: {
    ':hover': {
      backgroundColor: 'black'
    }
  }
}
