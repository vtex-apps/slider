import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { IconCaret } from 'vtex.dreamstore-icons'

const Arrow = props => {
  const {
    tag: RootTag,
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
  /** Classes to be passed to the internal elements */
  classes: PropTypes.shape({
    container: PropTypes.string,
    arrow: PropTypes.string
  }),
  /** Tag to be rendered as the root fo the component */
  tag: PropTypes.string,
  /** onClick callback */
  onClick: PropTypes.func.isRequired,
  /** Orientation of the Arrow */
  orientation: PropTypes.oneOf(['left', 'right']),
  /** Size of the icon */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

Arrow.defaultProps = {
  tag: 'div',
  orientation: 'left'
}

export default Arrow
