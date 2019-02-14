import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const render = (props, ref) => {
  const {
    tag: RootTag,
    className,
    children,
    ...otherProps
  } = props

  return (
    <RootTag
      ref={ref}
      className={classnames(className, 'relative')}
      {...otherProps}
    >
      {children}
    </RootTag>
  )
}

render.displayName = 'SliderContainer'

const SliderContainer = React.forwardRef(render)

SliderContainer.propsTypes = {
  tag: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

SliderContainer.defaultProps = {
  tag: 'div'
}

export default SliderContainer
