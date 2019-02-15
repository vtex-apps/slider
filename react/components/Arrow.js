
import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from './styles'

function getBorderValue(thickness) {
  if (typeof thickness === 'number') {
    return `solid ${thickness}px currentColor`
  }
  return `solid ${thickness} currentColor`
}

const Arrow = props => {
  const {
    tag: TagRoot,
    thickness,
    right,
    size,
    className,
    ...restProps
  } = props

  const style = {
    transform: `rotate(${right ? 45 : -135}deg) translate(0, -50%)`,
    borderLeft: 'none',
    borderBottom: 'none',
    top: '50%',
    transformOrigin: '50% 0',
    borderTop: getBorderValue(thickness),
    borderRight: getBorderValue(thickness),
    ...(size ? { height: size, width: size } : {})
  }

  return <TagRoot
    className={classnames(styles.arrow, className, 'bg-transparent absolute pa0')}
    style={style}
    {...restProps}
  />
}

Arrow.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.string,
  right: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  thickness: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

Arrow.defaultProps = {
  tag: 'button',
  right: false
}

export default Arrow
