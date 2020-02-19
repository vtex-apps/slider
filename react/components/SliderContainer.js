import React, { PureComponent } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class SliderContainerComponent extends PureComponent {
  timeoutRef = null

  setNewTimeout = () => {
    const { autoplay, autoplayInterval, onNextSlide } = this.props

    if (
      !autoplay ||
      typeof autoplayInterval !== 'number' ||
      autoplayInterval === 0
    ) {
      return
    }

    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef)
    }

    this.timeoutRef = setTimeout(() => {
      if (onNextSlide) {
        onNextSlide()
      }

      this.setNewTimeout()
    }, autoplayInterval)
  }

  componentDidMount() {
    if (this.props.autoplay && this.props.autoplayInterval > 0) {
      this.setNewTimeout()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutRef)
  }

  eventProcedure = (e, eventCallback, clearOnPause = true) => {
    const { pauseOnHover } = this.props
    if (pauseOnHover) {
      clearOnPause ? clearTimeout(this.timeoutRef) : this.setNewTimeout()
    }
    if (eventCallback) {
      eventCallback(e)
    }
  }

  handleTouchStart = e => {
    this.eventProcedure(e, this.props.onTouchStart)
  }

  handleTouchEnd = e => {
    this.eventProcedure(e, this.props.onTouchEnd, false)
  }

  handleMouseEnter = e => {
    this.eventProcedure(e, this.props.onMouseEnter)
  }

  handleMouseLeave = e => {
    this.eventProcedure(e, this.props.onMouseLeave, false)
  }

  render() {
    const {
      className,
      children,
      tag: RootTag,
      innerRef,
      ...otherProps
    } = this.props

    return (
      <RootTag
        ref={innerRef}
        className={classnames(className, 'relative')}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        {...otherProps}
      >
        {children}
      </RootTag>
    )
  }
}

const renderForwardRef = (props, ref) => (
  <SliderContainerComponent innerRef={ref} {...props} />
)
renderForwardRef.displayName = 'SliderContainer'
const SliderContainer = React.forwardRef(renderForwardRef)

SliderContainer.propsTypes = {
  /** If the slider should be passing automatically */
  autoplay: PropTypes.boolean,
  /** Time in milliseconds of the interval to pass from a slider to the next one */
  autoplayInterval: PropTypes.number,
  /** Children of the component to render */
  children: PropTypes.node.isRequired,
  /** Classes to be applied to the root element */
  className: PropTypes.string,
  /** Function to go to the next slide */
  onNextSlide: PropTypes.func,
  /** If the interval should not be executed if the mouse is on the component */
  pauseOnHover: PropTypes.boolean,
  /** Tag to render the component */
  tag: PropTypes.string,
}

SliderContainer.defaultProps = {
  autoplay: false,
  autoplayInterval: 5000,
  pauseOnHover: true,
  tag: 'div',
}

export default SliderContainer
