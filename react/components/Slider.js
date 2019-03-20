import React, { PureComponent, Fragment } from 'react'
import debounce from 'debounce'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import EventListener from 'react-event-listener'
import styles from './styles.css'
import {
  resolveSlidesNumber,
  getStylingTransition,
  getTranslateProperty,
  setStyle,
  constants
} from '../utils'

const getDisplaySameSlide = (props, nextProps) => {
  let displaySameSlide = false
  const getChildrenKey = child => (child ? child.key : 'empty')

  if (props.children.length && nextProps.children.length) {
    const oldKeys = React.Children.map(props.children, getChildrenKey)
    const oldKey = oldKeys[props.index]

    if (oldKey !== null && oldKey !== undefined) {
      const newKeys = React.Children.map(nextProps.children, getChildrenKey)
      const newKey = newKeys[nextProps.index]

      if (oldKey === newKey) {
        displaySameSlide = true
      }
    }
  }

  return displaySameSlide
}

class Slider extends PureComponent {
  static propTypes = {
    /** A render function that will receive as props an orientation prop
     * and a onClick callback */
    arrowRender: PropTypes.func,
    /** The component used to contain both arrows.
     * Either a string to use a DOM element or a component.
     */
    arrowsContainerComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /** The slides to render */
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    /** Classes to apply to the Slider elements */
    classes: PropTypes.shape({
      root: PropTypes.string,
      sliderFrame: PropTypes.string,
    }),
    /** Current slide on the screen (if you have perPage > 1, then the current slide is the most left slide on the screen) */
    currentSlide: PropTypes.number,
    /** Css value of cursor when mouse is hovering the slider frame */
    cursor: PropTypes.string,
    /** Css value of cursos when mouse is down */
    cursorOnMouseDown: PropTypes.string,
    // TODO draggable: PropTypes.bool,
    /** Duration of transitions */
    duration: PropTypes.number,
    /** Transition function */
    easing: PropTypes.string,
    /** Function to change the value of currentSlide */
    onChangeSlide: PropTypes.func.isRequired,
    /** Amount of slides to be on the screen, if a number is passed, then thats the slides that will be shown,
     * if an object with breakpoints is passed, then the component will check the size of the screen to see how
     * many elements will be on the screen
     */
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Resize debounce timer in milliseconds */
    resizeDebounce: PropTypes.number,
    /** Tag to be rendered in the root element of the page */
    rootTag: PropTypes.string,
    /** Tag to be rendered in the slider frame */
    sliderFrameTag: PropTypes.string,
    /** Threshold of pixels to drag to the slider let it go to the next/prev slide */
    threshold: PropTypes.number,
  }

  static defaultProps = {
    classes: {
      root: '',
      sliderFrame: ''
    },
    currentSlide: 0,
    cursor: '-webkit-grab',
    cursorOnMouseDown: '-webkit-grabbing',
    draggable: true,
    duration: 250,
    easing: 'ease-out',
    loop: true,
    perPage: 1,
    resizeDebounce: constants.defaultResizeDebounce,
    rootTag: 'div',
    showArrows: false,
    sliderFrameTag: 'ul',
    threshold: 20
  }

  static events = ['onTouchStart', 'onTouchEnd', 'onTouchMove', 'onMouseUp', 'onMouseDown', 'onMouseLeave', 'onMouseMove']

  static getDerivedStateFromProps(nextProps, prevState) {
    const perPage = resolveSlidesNumber(nextProps.perPage)
    
  }

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
    this._sliderFrameWidth = 0
    this.handleResize = debounce(this.fit, props.resizeDebounce)

    this.state = {
      firstRender: true,
      currentSlide: props.currentSlide,
      renderCount: 0
    }
  }

  componentDidMount() {
    const { onChangeSlide, currentSlide, loop } = this.props
    if (loop) {
      onChangeSlide(currentSlide + this.perPage)
    }
    this.setState({
      firstRender: false,
      renderCount: 1
    })
  }

  componentWillUnmount() {
    this.handleResize.clear()
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentSlide, easing, duration, cursor } = this.props

    this.setSelectorWidth()
    this.setInnerElements()
    this.perPage = resolveSlidesNumber(this.props.perPage)
    setStyle(this._sliderFrame.current, {
      ...getStylingTransition(easing, duration),
      width: `${this.totalSlides / this.perPage * 100}%`,
      ...(this.totalSlides > 1 ? { cursor } : {}),
    })
    this._sliderFrameWidth = this._sliderFrame.current.getBoundingClientRect().width

    this.innerElements.forEach(el => {
      setStyle(el, {
        width: `${100 / this.totalSlides}%`,
      })
    })
    const newCurrentSlide = Math.min(Math.max(currentSlide, 0), this.totalSlides - this.perPage)
    this.slideToCurrent(!getDisplaySameSlide(prevProps, this.props), newCurrentSlide)

    if (prevState.renderCount === 1) {
      this.setState({ renderCount: 2 })
    }
  }

  isNextSlideClone = (newCurrentSlide, howManySlides) => {
    return newCurrentSlide + howManySlides > this.innerElements.length - this.perPage    
  }

  isPrevSlideClone = (newCurrentSlide, howManySlides) => {
    return newCurrentSlide - howManySlides < 0
  }

  fit = () => {
    const { perPage, currentSlide, onChangeSlide } = this.props
    this.perPage = resolveSlidesNumber(perPage)
    const newCurrentSlide = Math.floor(currentSlide / this.perPage) * this.perPage

    this.setSelectorWidth()
    this._sliderFrameWidth = this._sliderFrame.current.getBoundingClientRect().width

    if (currentSlide !== newCurrentSlide) {
      onChangeSlide(newCurrentSlide)
    }

    this.slideToCurrent(true, newCurrentSlide)
    this.forceUpdate()
  }

  setSelectorWidth = () => {
    this.selectorWidth = this._selector.current.getBoundingClientRect().width
  }

  setInnerElements = () => {
    this.innerElements = Array.prototype.slice.call(this._sliderFrame.current.children)
  }

  get totalSlides() {
    const { loop, children } = this.props
    const { firstRender } = this.state

    if (children) {
      const totalChildren = React.Children.count(this.props.children)
      return totalChildren + (loop && !firstRender ? 2 * this.perPage : 0)
    }

    return 0
  }

  get childrenLength() {
      return this.props.children ? React.Children.count(this.props.children) : 0
  }

  prev = (howManySlides = 1) => {
    if (this.totalSlides <= this.perPage) {
      return
    }

    const { onChangeSlide, currentSlide, loop, draggable, easing } = this.props

    const newCurrentSlide =  Math.max(currentSlide - howManySlides, 0)

    if (loop) {
      if (this.isNextSlideClone(currentSlide, howManySlides)) {
        const mirrorIndex = currentSlide + this.totalSlides
        const mirrorIndexOffset = this.perPage
        const moveTo = mirrorIndex + mirrorIndexOffset
        const offset = -1 * moveTo * (this.selectorWidth / this.perPage)
        const dragDistante = draggable ? this.drag.endX - this.drag.startX : 0
        const percentageTranslation = (offset + dragDistante) / this._sliderFrameWidth * 100

        setStyle(this._sliderFrame.current, {
          ...getStylingTransition(easing),
          ...getTranslateProperty(percentageTranslation)
        })
      }
    }

    if (newCurrentSlide !== currentSlide) {
      this.slideToCurrent(true, newCurrentSlide)
      onChangeSlide(newCurrentSlide)
    }

    return newCurrentSlide
  }

  next = (howManySlides = 1) => {
    if (this.totalSlides <= this.perPage) {
      return
    }

    const { onChangeSlide, currentSlide } = this.props
    const newCurrentSlide = Math.min(currentSlide + howManySlides, this.totalSlides - this.perPage)
    if (newCurrentSlide !== currentSlide) {
      this.slideToCurrent(true, newCurrentSlide)
      onChangeSlide(newCurrentSlide)
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
    const { onChangeSlide, currentSlide } = this.props

    if (this.totalSlides <= this.perPage) {
      return
    }

    const newCurrentSlide = Math.min(Math.max(index, 0), this.totalSlides - this.perPage)

    if (newCurrentSlide !== currentSlide) {
      this.slideToCurrent(false, newCurrentSlide)
      onChangeSlide(newCurrentSlide)
    }
  }

  slideToCurrent = (shouldEnableTransition, currentSlide) => {
    const { easing, duration } = this.props
    const offset = -1 * currentSlide * 100 / this.totalSlides
    if (shouldEnableTransition) {
      setStyle(this._sliderFrame.current, {
        ...getStylingTransition(easing, duration), // enable transition
        ...getTranslateProperty(offset)
      })
    } else {
      setStyle(this._sliderFrame.current, {
        ...getStylingTransition(easing),
        ...getTranslateProperty(offset)
      })
    }
  }

  updateAfterDrag = () => {
    const { threshold, currentSlide } = this.props
    const movement = this.drag.endX - this.drag.startX
    const movementDistance = Math.abs(movement)
    const howManySliderToSlide = Math.ceil(movementDistance / (this.selectorWidth / this.perPage))

    let newCurrentSlide = currentSlide
    if (movement > 0 && movementDistance > threshold && this.totalSlides > this.perPage) {
      newCurrentSlide = this.prev(howManySliderToSlide)
    } else if (movement < 0 && movementDistance > threshold && this.totalSlides > this.perPage) {
      newCurrentSlide = this.next(howManySliderToSlide)
    }
    this.slideToCurrent(true, newCurrentSlide)
  }

  _clearDrag = () => {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null
    }
  }

  onTouchStart = e => {
    this.pointerDown = true
    this.drag.startX = e.touches[0].pageX
    this.drag.startY = e.touches[0].pageY
  }

  onTouchEnd = () => {
    const { easing, duration } = this.props

    this.pointerDown = false
    setStyle(this._sliderFrame.current, { ...getStylingTransition(easing, duration) })
    if (this.drag.endX) {
      this.updateAfterDrag()
    }
    this._clearDrag()
  }

  onTouchMove = e => {
    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX)
    }

    if (this.pointerDown && this.drag.letItGo) {
      const { easing, currentSlide } = this.props

      this.drag.endX = e.touches[0].pageX

      const currentOffset = currentSlide * (this.selectorWidth / this.perPage)
      const dragOffset = this.drag.endX - this.drag.startX
      const offset = (currentOffset - dragOffset) / this._sliderFrameWidth * -100

      setStyle(this._sliderFrame.current, {
        ...getStylingTransition(easing),
        ...getTranslateProperty(offset),
      })
    }
  }

  onMouseDown = e => {
    const { cursorOnMouseDown } = this.props
    e.preventDefault()
    this.pointerDown = true
    this.drag.startX = e.pageX

    setStyle(this._sliderFrame.current, {
      cursor: cursorOnMouseDown
    })
  }

  onMouseUp = () => {
    const { cursor } = this.props

    this.pointerDown = false
    setStyle(this._sliderFrame.current, { cursor })
    if (this.drag.endX) {
      this.updateAfterDrag()
    }

    this._clearDrag()
  }

  onMouseMove = e => {
    const { currentSlide, draggable, cursorOnMouseDown, easing } = this.props
    e.preventDefault()
    if (this.pointerDown && draggable) {
      // TODO prevent link clicks
      this.drag.endX = e.pageX

      const currentOffset = currentSlide * (this.selectorWidth / this.perPage)
      const dragOffset = (this.drag.endX - this.drag.startX)
      const offset = (currentOffset - dragOffset) / this._sliderFrameWidth * -100

      setStyle(this._sliderFrame.current, {
        cursor: cursorOnMouseDown,
        ...getStylingTransition(easing),
        ...getTranslateProperty(offset)
      })
    }
  }

  onMouseLeave = e => {

    if (this.pointerDown) {
      const { cursor, draggable } = this.props
      this.pointerDown = false
      this.drag.endX = e.pageX

      if (draggable) {
        setStyle(this._sliderFrame.current, { cursor })
      }
      this.updateAfterDrag()
      this._clearDrag()
    }
  }

  renderArrows = () => {
    const {
      arrowsContainerComponent: ArrowsContainerComponent,
      arrowRender
    } = this.props

    if (!arrowRender) {
      return null
    }

    const arrows = (
      <Fragment>
        {arrowRender({ orientation: 'left', onClick: this.prevPage })}
        {arrowRender({ orientation: 'right', onClick: this.nextPage })}
      </Fragment>
    )
    return ArrowsContainerComponent ? (
      <ArrowsContainerComponent>
        {arrows}
      </ArrowsContainerComponent>
    ) : arrows
  }

  render() {
    const {
      children,
      sliderFrameTag: SliderFrameTag,
      rootTag: RootTag,
      classes: classesProp,
      currentSlide,
      loop
    } = this.props
    const { firstRender, renderCount } = this.state
    if (!this.perPage) {
      this.perPage = resolveSlidesNumber(this.props.perPage)
    }

    const classes = {
      ...Slider.defaultProps.classes,
      ...classesProp
    }

    const arrayChildren = React.Children.toArray(children)

    let sliderFrameStyle = {
      width: `${100 * this.totalSlides / this.perPage}%`,
    }

    if (loop && renderCount === 1) {
      sliderFrameStyle = {
        ...sliderFrameStyle,
        ...getTranslateProperty((loop ? currentSlide + this.perPage : currentSlide) / this.totalSlides * -100)
      }
    }

    return (
      <Fragment>
        {this.totalSlides > 1 && this.renderArrows()}
        <RootTag
          className={classnames(classes.root, 'overflow-hidden h-100')}
          ref={this._selector}
          {...(this.totalSlides > 1 ? Slider.events.reduce((props, event) => ({ ...props, [event]: this[event] }), {}) : {})}
        >
          <EventListener target="window" onResize={this.handleResize} />
          <SliderFrameTag
            className={classnames(classes.sliderFrame, styles.sliderFrame, 'list pa0 h-100 ma0 flex')}
            style={sliderFrameStyle}
            ref={this._sliderFrame}
          >
            {!firstRender && React.Children.map(arrayChildren.slice(children.length - this.perPage, children.length),
              (child, indexChild) => {
                let hidden = true
                if (indexChild === currentSlide) {
                  hidden = false
                }
                return React.cloneElement(child, {
                  'aria-hidden': hidden,
                  style: {
                    ...(child.props.style ? child.props.style : {}),
                    width: `${100 / this.totalSlides}%`,
                  }
                })
              })}
            {React.Children.map(arrayChildren, (child, indexChild) => {
              let hidden = true
              if (indexChild === currentSlide) {
                hidden = false
              }

              return React.cloneElement(child, {
                'aria-hidden': hidden,
                style: {
                  ...(child.props.style ? child.props.style : {}), 
                  width: `${100 / this.totalSlides}%`,
                }
              })
            })}
            {!firstRender && React.Children.map(arrayChildren.slice(children.length - this.perPage, children.length),
              (child, indexChild) => {
                let hidden = true
                if (indexChild === currentSlide) {
                  hidden = false
                }
                return React.cloneElement(child, {
                  'aria-hidden': hidden,
                  style: {
                    ...(child.props.style ? child.props.style : {}),
                    width: `${100 / this.totalSlides}%`,
                  }
                })
              })}
          </SliderFrameTag>
        </RootTag>
      </Fragment>
    )
  }
}

export default Slider
