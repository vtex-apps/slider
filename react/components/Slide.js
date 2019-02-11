import React, { Component } from 'react'
import EventListener from 'react-event-listener'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'debounce'
import styles from './styles.css'

class SlideComponent extends Component {
  constructor(props) {
    super(props)
    this.imgRef = React.createRef()
    if (typeof window !== 'undefined') {
      this.handleResize = debounce(() => {
        setTimeout(() => {
          this.fit()
        }, props.resizeDebounce)
      }, props.resizeDebounce)
    }
  }

  componentDidMount() {
    this.ensureImageCover()
  }

  componentDidUpdate() {
    this.ensureImageCover()
  }

  componentWillUnmount() {
    this.handleResize.clear()
  }

  fit = () => {
    const { current: imgElement } = this.imgRef

    if (!imgElement || !imgElement.complete) {
      return
    }

    if (
      imgElement.width / imgElement.height >
      imgElement.parentNode.offsetWidth / imgElement.parentNode.offsetHeight
    ) {
      imgElement.classList.remove(styles.slideImgFullWidth)
      imgElement.classList.add(styles.slideImgFullHeight)
    } else {
      imgElement.classList.remove(styles.slideImgFullHeight)
      imgElement.classList.add(styles.slideImgFullWidth)
    }

    imgElement.removeEventListener('load', this.fit)
  }

  ensureImageCover = () => {
    const { current: imgElement } = this.imgRef
    if (!imgElement || !this.props.fitImg) {
      return
    }

    if (imgElement.complete) {
      this.fit()
    } else {
      imgElement.addEventListener('load', this.fit)
    }
  }

  render() {
    const {
      children,
      className,
      tag: RootComponent,
      fitImg,
      innerRef,
      resizeDebounce,
      ...rootProps
    } = this.props

    return (
      <RootComponent ref={innerRef} className={classnames(styles.slide, className)} {...rootProps}>
        <EventListener target="window" onResize={this.handleResize} />
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) {
            return null
          }
          if (fitImg && child.type === 'img') {
            return React.cloneElement(child, {
              ref: this.imgRef,
              className: classnames(styles.slideImg, child.props.className)
            })
          }

          return child
        })}
      </RootComponent>
    )
  }
}

const renderFormwardRef = (props, ref) => <SlideComponent innerRef={ref} {...props} />

renderFormwardRef.displayName = 'Slide'

const Slide = React.forwardRef(renderFormwardRef)

Slide.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tag: PropTypes.string,
  fitImg: PropTypes.bool,
  resizeDebounce: PropTypes.number
}

Slide.defaultProps = {
  tag: 'li',
  fitImg: true,
  resizeDebounce: 250
}

export default Slide
