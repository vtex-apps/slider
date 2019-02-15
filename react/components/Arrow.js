import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { IconCaret } from 'vtex.dreamstore-icons'

const Arrow = props => {
  const {
    rootTag: RootTag,
    orientation,
    size,
    classes,
    ...restProps
  } = props

  const containerStyle = size ? { height: size + 10, width: size + 10 } : {}

  return (
    <RootTag
      className={classnames(styles.arrowContainer, classes.container, 'bg-transparent bn absolute pa2')}
      style={containerStyle}
      {...restProps}
    >
      <IconCaret className={classes.arrow} size={size} orientation={orientation} />
    </RootTag>
  )
}

Arrow.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.shape({
    container: PropTypes.string,
    arrow: PropTypes.string
  }),
  tag: PropTypes.string,
  right: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

Arrow.defaultProps = {
  rootTag: 'div',
  orientation: 'left'
}

export default Arrow
