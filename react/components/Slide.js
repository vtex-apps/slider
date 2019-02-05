import React, { forwardRef } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const render = (props, ref) => {
  const {
    children,
    className,
    tag: RootComponent,
    ...rootProps
  } = props
  
  return (
    <RootComponent ref={ref} className={classnames('slide', className)} {...rootProps}>
      {children}
    </RootComponent>
  )
}

render.displayName = 'Slide'

const Slide = forwardRef(render)

Slide.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tag: PropTypes.string
}

Slide.defaultProps = {
  tag: 'div'
}

export default Slide
