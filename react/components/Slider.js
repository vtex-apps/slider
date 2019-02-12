import React, { Component } from 'react'
import debounce from 'debounce'
import PropTypes from 'prop-types'
import {
  resolveSlidesNumber,
  getStylingTransition,
  setTransformProperty,
  setStyle,
} from '../utils'
import styles from './styles'

class Slider extends Component {
  static propTypes = {
    resizeDebounce: PropTypes.number,
    sliderFrameTag: PropTypes.string,
    onChangeSlide: PropTypes.func.isRequired,
    duration: PropTypes.number,
    easing: PropTypes.string,
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    // TODO draggable: PropTypes.bool,
    threshold: PropTypes.number,
    loop: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  }

  static defaultProps = {
    resizeDebounce: 250,
    duration: 250,
    easing: 'ease-out',
    perPage: 1,
    currentSlide: 0,
    draggable: true,
    threshold: 20,
    loop: false,
    sliderFrameTag: 'ul'
  }

  static events = ['onMouseUp', 'onMouseDown', 'onMouseLeave', 'onMouseMove']

  constructor(props) {
    super(props)

    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null
    }
  }

  componentDidMount() {
    this.init()
    this.onResize = debounce(this.handleResize, this.props.resizeDebounce)
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  componentDidUpdate() {
    this.init()
  }

  enableTransition = (extraStyles = {}) => {
    const { easing, duration } = this.props

    setStyle(this._sliderFrame, {
      ...getStylingTransition(easing, duration),
      ...extraStyles
    })
  }

  disableTransition = (extraStyles = {}) => {
    const { easing } = this.props
    setStyle(this._sliderFrame, {
      ...getStylingTransition(easing),
      ...extraStyles
    })
  }

  init = () => {
    const { draggable, currentSlide, loop } = this.props
    this.setSelectorWidth()
    this.setInnerElements()
    this.perPage = resolveSlidesNumber(this.props.perPage)
    this.enableTransition({
      width: `${(this.selectorWidth / this.perPage) * this.innerElements.length}px`,
      ...(draggable ? { cursor: '-webkit-grab' } : {}),
    })

    this.innerElements.forEach(el => {
      setStyle(el, {
        width: `${100 / this.innerElements.length}%`
      })
    })
    let newCurrentSlide = loop ? currentSlide % this.totalSlides : Math.min(Math.max(currentSlide, 0), this.totalSlides - this.perPage)
    this.slideToCurrent(false, newCurrentSlide)
  }

  handleResize = () => {
    const { perPage, currentSlide, onChangeSlide } = this.props
    this.perPage = resolveSlidesNumber(perPage)
    const newCurrentSlide = Math.floor(currentSlide / this.perPage) * this.perPage

    this.setSelectorWidth()
    setStyle(this._sliderFrame, {
      width: `${(this.selectorWidth / this.perPage) * this.innerElements.length}px`
    })

    if (currentSlide !== newCurrentSlide) {
      onChangeSlide(newCurrentSlide)
    }

    this.slideToCurrent(false, newCurrentSlide)
    this.forceUpdate()
  }

  setSelectorWidth = () => {
    this.selectorWidth = this._selector.getBoundingClientRect().width
  }

  setInnerElements = () => {
    this.innerElements = Array.prototype.slice.call(this._sliderFrame.children)
  }

  get totalSlides() {
    if (this.innerElements && this.perPage) {
      return this.props.loop ? this.innerElements.length - 2 * this.perPage : this.innerElements.length
    }
    return 0
  }

  prev = (howManySlides = 1) => {
    if (this.totalSlides <= this.perPage) {
      return
    }

    const {
      loop,
      draggable,
      onChangeSlide,
      currentSlide
    } = this.props

    let newCurrentSlide = currentSlide
    if (loop) {
      const isNewIndexClone = currentSlide - howManySlides < 0
      if (isNewIndexClone) {
        this.disableTransition()

        const mirrorSlideIndex = currentSlide + this.innerElements.length - (2 * this.perPage)
        const mirrorSlideIndexOffset = this.perPage
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset
        const offset = -1 * moveTo * (this.selectorWidth / this.perPage)
        const dragDistance = draggable ? this.drag.endX - this.drag.startX : 0

        requestAnimationFrame(() => {
          setTransformProperty(this._sliderFrame, offset + dragDistance)
        })
        newCurrentSlide = mirrorSlideIndex - howManySlides
      } else {
        newCurrentSlide -= howManySlides
      }
    } else {
      newCurrentSlide = Math.max(currentSlide - howManySlides, 0)
    }

    if (newCurrentSlide !== currentSlide) {
      this.slideToCurrent(loop, newCurrentSlide)
      requestAnimationFrame(() => {
        onChangeSlide(newCurrentSlide)
      })
    }

    return newCurrentSlide
  }

  next = (howManySlides = 1) => {
    if (this.totalSlides <= this.perPage) {
      return
    }

    const {
      loop,
      draggable,
      onChangeSlide,
      currentSlide
    } = this.props

    let newCurrentSlide = currentSlide

    if (loop) {
      const isNewIndexClone = currentSlide + howManySlides > this.innerElements.length - (3 * this.perPage)
      if (isNewIndexClone) {
        this.disableTransition()

        const mirrorSlideIndex = currentSlide - this.innerElements.length + (2 * this.perPage)
        const mirrorSlideIndexOffset = this.perPage
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset
        const offset = -1 * moveTo * (this.selectorWidth / this.perPage)
        const dragDistance = draggable ? this.drag.endX - this.drag.startX : 0

        requestAnimationFrame(() => {
          setTransformProperty(this._sliderFrame, offset + dragDistance)
        })
        newCurrentSlide = mirrorSlideIndex + howManySlides
      } else {
        newCurrentSlide += howManySlides
      }
    } else {
      newCurrentSlide = Math.min(currentSlide + howManySlides, this.innerElements.length - this.perPage)
    }

    if (newCurrentSlide !== currentSlide) {
      this.slideToCurrent(loop, newCurrentSlide)
      requestAnimationFrame(() => {
        onChangeSlide(newCurrentSlide)
      })
    }

    return newCurrentSlide
  }

  prevPage = () => {
    this.prev(this.perPage)
  }

  nextPage = () => {
    this.next(this.perPage)
  }

  goTo = index => {
    const { onChangeSlide, currentSlide, loop } = this.props

    if (this.totalSlides <= this.perPage) {
      return
    }

    let newCurrentSlide = loop ? index % this.totalSlides : Math.min(Math.max(index, 0), this.totalSlides - this.perPage)

    if (newCurrentSlide !== currentSlide) {
      this.slideToCurrent(false, newCurrentSlide)
      onChangeSlide(newCurrentSlide)
    }
  }

  slideToCurrent = (shouldEnableTransition, current) => {
    const currentSlide = this.props.loop ? current + this.perPage : current
    const offset = -1 * currentSlide * (this.selectorWidth / this.perPage)

    if (shouldEnableTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.enableTransition()
          setTransformProperty(this._sliderFrame, offset)
        })
      })
    } else {
      setTransformProperty(this._sliderFrame, offset)
    }
  }

  updateAfterDrag = () => {
    const { threshold, currentSlide } = this.props
    const movement = this.drag.endX - this.drag.startX
    const movementDistance = Math.abs(movement)
    const howManySliderToSlide = Math.ceil(movementDistance / (this.selectorWidth / this.perPage))

    const slideToNegativeClone = movement > 0 && currentSlide - howManySliderToSlide < 0
    const slideToPositiveClone = movement < 0 && currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage

    let newCurrentSlide = currentSlide
    if (movement > 0 && movementDistance > threshold && this.innerElements.length > this.perPage) {
      newCurrentSlide = this.prev(howManySliderToSlide)
    } else if (movement < 0 && movementDistance > threshold && this.innerElements.length > this.perPage) {
      newCurrentSlide = this.next(howManySliderToSlide)
    }
    this.slideToCurrent(slideToNegativeClone || slideToPositiveClone, newCurrentSlide)
  }

  _clearDrag = () => {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null
    }
  }

  // TODO add touch events

  onMouseDown = e => {
    e.preventDefault()
    e.stopPropagation()
    this.pointerDown = true
    this.drag.startX = e.pageX
  }

  onMouseUp = e => {
    const { draggable } = this.props

    e.stopPropagation()
    this.pointerDown = false
    this.enableTransition( draggable ? { cursor: '-webkit-grab' } : {})

    if (this.drag.endX) {
      this.updateAfterDrag()
    }

    this._clearDrag()
  }

  onMouseMove = e => {
    const { easing, loop, currentSlide, draggable } = this.props

    e.preventDefault()
    if (this.pointerDown && draggable) {
      // TODO prevent link clicks

      this.drag.endX = e.pageX

      const computedCurrentSlide = loop ? currentSlide + this.perPage : currentSlide
      const currentOffset = computedCurrentSlide * (this.selectorWidth / this.perPage)
      const dragOffset = (this.drag.endX - this.drag.startX)
      const offset = currentOffset - dragOffset

      setStyle(this._sliderFrame, {
        cursor: '-webkit-grabbing',
        webkitTransition: `all 0ms ${easing}`,
        transition: `all 0ms ${easing}`,
        transform: `translate3d(${offset * -1}px, 0, 0)`,
        WebkitTransform: `translate3d(${offset * -1}px, 0, 0)`
      })
    }
  }

  onMouseLeave = e => {

    if (this.pointerDown) {
      const { draggable } = this.props
      this.pointerDown = false
      this.drag.endX = e.pageX

      this.enableTransition(draggable ? { cursor: '-webkit-grab' } : {})
      this.updateAfterDrag()
      this._clearDrag()
    }
  }

  render() {
    const { children: childrenProp, loop, sliderFrameTag: SliderFrameTag } = this.props
    if (!this.perPage) {
      this.perPage = resolveSlidesNumber(this.props.perPage)
    }

    const newChildren = loop ? React.Children.map([
      ...childrenProp.slice(childrenProp.length - this.perPage, childrenProp.length),
      ...childrenProp,
      ...childrenProp.slice(0, this.perPage)
    ], (c, i) => React.cloneElement(c, { key: i })) : childrenProp

    return (
      <div
        className={styles.sliderRoot}
        ref={selector => this._selector = selector}
        {...Slider.events.reduce((props, event) => ({ ...props, [event]: this[event] }), {})}
      >
        <SliderFrameTag className={styles.sliderFrame} ref={sliderFrame => this._sliderFrame = sliderFrame}>
          {newChildren}
        </SliderFrameTag>
      </div>
    )
  }
}

export default Slider
