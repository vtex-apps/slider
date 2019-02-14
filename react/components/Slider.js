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
    /** Resize debounce timer in milliseconds */
    resizeDebounce: PropTypes.number,
    /** Tag to be rendered in the slider frame */
    sliderFrameTag: PropTypes.string,
    /** Current slide on the screen (if you have perPage > 1, then the current slide is the most left slide on the screen) */
    currentSlide: PropTypes.number,
    /** Function to change the value of currentSlide */
    onChangeSlide: PropTypes.func.isRequired,
    /** Duration of transitions */
    duration: PropTypes.number,
    /** Transition function */
    easing: PropTypes.string,
    /** Amount of slides to be on the screen, if a number is passed, then thats the slides that will be shown,
     * if an object with breakpoints is passed, then the component will check the size of the screen to see how
     * many elements will be on the screen
     */
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    // TODO draggable: PropTypes.bool,
    /** Threshold of pixels to drag to the slider let it go to the next/prev slide */
    threshold: PropTypes.number,
    /** If the slider should loop or not */
    loop: PropTypes.bool,
    /** The slides to render */
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

    this._selector = React.createRef()
    this._sliderFrame = React.createRef()
  }

  componentDidMount() {
    this.init()
    this.onResize = debounce(this.handleResize, this.props.resizeDebounce)
    window.addEventListener('resize', this.onResize)
    this.setState({ firstRender: false })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  componentDidUpdate() {
    this.init()
  }

  enableTransition = (extraStyles = {}) => {
    const { easing, duration } = this.props

    setStyle(this._sliderFrame.current, {
      ...getStylingTransition(easing, duration),
      ...extraStyles
    })
  }

  disableTransition = (extraStyles = {}) => {
    const { easing } = this.props
    setStyle(this._sliderFrame.current, {
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
    setStyle(this._sliderFrame.current, {
      width: `${(this.selectorWidth / this.perPage) * this.innerElements.length}px`
    })

    if (currentSlide !== newCurrentSlide) {
      onChangeSlide(newCurrentSlide)
    }

    this.slideToCurrent(false, newCurrentSlide)
    this.forceUpdate()
  }

  setSelectorWidth = () => {
    this.selectorWidth = this._selector.current.getBoundingClientRect().width
  }

  setInnerElements = () => {
    this.innerElements = Array.prototype.slice.call(this._sliderFrame.current.children)
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
          setTransformProperty(this._sliderFrame.current, offset + dragDistance)
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
          setTransformProperty(this._sliderFrame.current, offset + dragDistance)
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
          setTransformProperty(this._sliderFrame.current, offset)
        })
      })
    } else {
      setTransformProperty(this._sliderFrame.current, offset)
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
    this.enableTransition(draggable ? { cursor: '-webkit-grab' } : {})

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

      setStyle(this._sliderFrame.current, {
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

  generateChildrenWithClones = (children, perPage) => {
    const childrenArray = React.Children.toArray(children)
    return React.Children.map([
      ...childrenArray.slice(childrenArray.length - perPage, childrenArray.length),
      ...childrenArray,
      ...childrenArray.slice(0, perPage)
    ], (c, i) => React.cloneElement(c, { key: i }))
  }

  render() {
    const { children: childrenProp, loop, sliderFrameTag: SliderFrameTag } = this.props
    if (!this.perPage) {
      this.perPage = resolveSlidesNumber(this.props.perPage)
    }

    const newChildren = loop ? this.generateChildrenWithClones(childrenProp, this.perPage)
      : childrenProp

    return (
      <div
        className={styles.sliderRoot}
        ref={this._selector}
        {...Slider.events.reduce((props, event) => ({ ...props, [event]: this[event] }), {})}
      >
        <SliderFrameTag className={styles.sliderFrame} ref={this._sliderFrame}>
          {newChildren}
        </SliderFrameTag>
      </div>
    )
  }
}

export default Slider
