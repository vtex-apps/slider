import React, { Component } from 'react'
import EventListener from 'react-event-listener'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'debounce'
import styles from './styles.css'
import { NoSSR } from 'vtex.render-runtime'

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
      imgElement.classList.remove('w-100')
      imgElement.classList.add('h-100')
    } else {
      imgElement.classList.remove('h-100')
      imgElement.classList.add('w-100')
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
      <RootComponent
        ref={innerRef}
        className={classnames(className, 'fl h-100 relative overflow-hidden')}
        {...rootProps}>
        <NoSSR>
          <EventListener target="window" onResize={this.handleResize} />
          {React.Children.map(children, child => {
            if (!React.isValidElement(child)) {
              return null
            }
            if (fitImg && child.type === 'img') {
              return React.cloneElement(child, {
                ref: this.imgRef,
                className: classnames(styles.slideImg, child.props.className, 'absolute')
              })
            }

            return child
          })}
        </NoSSR>
      </RootComponent>
    )
  }
}

const renderFormwardRef = (props, ref) => <SlideComponent innerRef={ref} {...props} />

renderFormwardRef.displayName = 'Slide'

const Slide = React.forwardRef(renderFormwardRef)

Slide.propTypes = {
  /** Node to render */
  children: PropTypes.node.isRequired,
  /** Classes to pass to root of slider */
  className: PropTypes.string,
  /** Tag to be rendered in root element */
  tag: PropTypes.string,
  /** If the slide component should try to fit the img (only works if children is an img element) */
  fitImg: PropTypes.bool,
  /** Time of debounce of resize event listener */
  resizeDebounce: PropTypes.number
}

Slide.defaultProps = {
  tag: 'li',
  fitImg: true,
  resizeDebounce: 250
}

export default Slide
