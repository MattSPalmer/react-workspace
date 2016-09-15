import React from 'react'

const Sizing = props => {
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

export default Sizing
