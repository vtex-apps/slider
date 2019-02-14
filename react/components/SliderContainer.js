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
  /** Children of the component to render */
  children: PropTypes.node.isRequired,
  /** classes to be applied to the root element */
  className: PropTypes.string,
  /** Tag to render the component */
  tag: PropTypes.string
}

SliderContainer.defaultProps = {
  tag: 'div'
}

export default SliderContainer
