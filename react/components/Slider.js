import React, { Fragment, useRef, useEffect, useMemo, useState } from 'react'
import debounce from 'debounce'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import EventListener from 'react-event-listener'
import styles from './styles.css'
import resolveSlidesNumber from '../utils/resolveSlidesNumber'
import {
  getStylingTransition,
  getTranslateProperty,
  setStyle,
  constants,
} from '../utils'

const Slider = ({
  sliderFrameTag: SliderFrameTag,
  rootTag: RootTag,
  ...props
}) => {
  const events = [
    'onTouchStart',
    'onTouchEnd',
    'onTouchMove',
    'onMouseUp',
    'onMouseDown',
    'onMouseLeave',
    'onMouseMove',
  ]

  const getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.currentSlide !== prevState.currentSlide) {
      const { currentSlide, children } = nextProps
      const perPage = resolveSlidesNumber(nextProps.perPage)
      const currentSlideIsClone =
        currentSlide < perPage ||
        currentSlide >= React.Children.count(children) + perPage
      return {
        currentSlide: currentSlideIsClone
          ? prevState.currentSlide
          : currentSlide,
        enableTransition: !currentSlideIsClone,
      }
    }

    return null
  }

  //Custom hook for those
  const handleResize = debounce(fit, props.resizeDebounce) //useEffect hook
  const [perPage, setPerPage] = useState(resolveSlidesNumber(props.perPage)) //useEffect hook

  const selectorRef = useRef(null)
  const sliderFrameRef = useRef(null)
  const [sliderFrameWidth, setSliderFrameWidth] = useState(0)
  const [selectorWidth, setSelectorWidth] = useState(0)
  const [firstRender, setFirstRender] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(props.currentSlide)
  const [enableTransition, setEnableTransition] = useState(false)
  const [dragDistance, setDragDistance] = useState(0)
  const [pointerDown, setPointerDown] = useState(false)

  //component did mount
  useEffect(() => {
    const { onChangeSlide, currentSlide, loop } = props
    let stateCurrentSlide = currentSlide
    if (loop) {
      if (isNegativeClone(currentSlide)) {
        onChangeSlide(currentSlide + perPage)
        stateCurrentSlide += perPage
      } else if (isPositiveClone(currentSlide)) {
        const mirrorIndex = childrenLength + perpage - currentSlide - 1
        onChangeSlide(mirrorIndex)
      }
    }
    setFirstRender(false)
    setCurrentSlide(stateCurrentSlide)

    return () => handleResize.clear() //component will unmount
  }, [])

  /* Implement this behavior
  const componentDidUpdate = () => {
    const newState = {
      currentSlide: this.state.currentSlide,
      dragDistance: 0,
      enableTransition: true,
    }

    if (this.props.currentSlide !== this.state.currentSlide) {
      const { currentSlide } = this.state
      const { onChangeSlide } = this.props
      if (this.isNegativeClone(currentSlide)) {
        newState.currentSlide = currentSlide + this.perPage
        onChangeSlide(newState.currentSlide)
      } else if (this.isPositiveClone(currentSlide)) {
        newState.currentSlide = this.totalSlides - currentSlide
        onChangeSlide(newState.currentSlide)
      } else {
        onChangeSlide(currentSlide)
      }
      this.setState(newState)
    } else if (this.state.dragDistance) {
      this.setState(newState)
    }

    this.setSelectorWidth()
    this.setInnerElements()
    this.perPage = resolveSlidesNumber(this.props.perPage)
    this._sliderFrameWidth = this.sliderFrameRef.current.getBoundingClientRect().width
  }*/

  const isNegativeClone = index => index < perPage

  const isPositiveClone = index => index >= childrenLength + perPage

  const getNegativeClone = index => index - childrenLength

  const getPositiveClone = index => index + childrenLength

  const fit = () => {
    setPerPage(resolveSlidesNumber(props.perPage))
    const newCurrentSlide = Math.floor(props.currentSlide / perPage) * perPage

    setSelectorWidth(selectorRef.current.getBoundingClientRect().width)
    setSliderFrameWidth(sliderFrameRef.current.getBoundingClientRect().width)

    if (props.currentSlide !== newCurrentSlide) {
      setCurrentSlide(newCurrentSlide)
      setEnableTransition(false)
      props.onChangeSlide(newCurrentSlide)
    }
    ///useForceUpdate
  }

  /*
  setInnerElements = () => {
    this.innerElements = Array.prototype.slice.call(
      this.sliderFrameRef.current.children
    )
  }*/

  /** Could cause error */
  const totalSlides = useMemo(
    () => childrenLength + (shouldAddClones ? 2 * perPage : 0),
    [childrenLength, perPage, shouldAddClones]
  )

  /** Could cause error */
  const childrenLength = useMemo(
    () => (props.children ? React.Children.count(props.children) : 0),
    [props.children]
  )

  const prev = (howManySlides = 1, dragDistance = 0) => {
    let newCurrentSlide = props.currentSlide
    let stateCurrentSlide
    let enableTransition = true

    if (totalSlides <= perPage) {
      return
    }

    if (props.loop) {
      if (isNegativeClone(props.currentSlide - howManySlides)) {
        newCurrentSlide = getPositiveClone(props.currentSlide)
        enableTransition = false
        stateCurrentSlide = newCurrentSlide - howManySlides
      } else {
        newCurrentSlide = props.currentSlide - howManySlides
        stateCurrentSlide = newCurrentSlide
      }
    } else {
      newCurrentSlide = Math.max(props.currentSlide - howManySlides, 0)
      stateCurrentSlide = newCurrentSlide
    }

    if (newCurrentSlide !== props.currentSlide) {
      setEnableTransition(enableTransition)
      setCurrentSlide(stateCurrentSlide)
      setDragDistance(dragDistance)
      props.onChangeSlide(newCurrentSlide)
    }
  }

  const next = (howManySlides = 1, dragDistance = 0) => {
    let newCurrentSlide = props.currentSlide
    let stateCurrentSlide
    let enableTransition = true

    if (totalSlides <= perPage) {
      return
    }

    if (props.loop) {
      if (isPositiveClone(props.currentSlide + howManySlides)) {
        newCurrentSlide = getNegativeClone(props.currentSlide)
        enableTransition = false
        stateCurrentSlide = newCurrentSlide + howManySlides
      } else {
        newCurrentSlide = props.currentSlide + howManySlides
        stateCurrentSlide = newCurrentSlide
      }
    } else {
      newCurrentSlide = Math.min(
        props.currentSlide + howManySlides,
        totalSlides - perPage
      )
      stateCurrentSlide = newCurrentSlide
    }

    if (newCurrentSlide !== props.currentSlide) {
      setCurrentSlide(stateCurrentSlide)
      setEnableTransition(enableTransition)
      setDragDistance(dragDistance)
      props.onChangeSlide(newCurrentSlide)
    }
  }

  const prevPage = useMemo(() => {
    prev(perPage)
  }, [perPage])

  const nextPage = useMemo(() => {
    next(perPage)
  }, [perPage])

  const onTouchStart = e => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const onTouchEnd = () => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const onTouchMove = e => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const onMouseDown = e => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const onMouseUp = () => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const onMouseMove = e => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const onMouseLeave = e => {
    e.preventDefault()
    //TODO: Implement dragging strategy
  }

  const renderArrows = () => {
    const {
      arrowsContainerComponent: ArrowsContainerComponent,
      arrowRender,
      scrollByPage,
    } = props

    if (!arrowRender) {
      return null
    }

    const arrows = (
      <Fragment>
        {arrowRender({
          orientation: 'left',
          onClick: scrollByPage ? prevPage : () => prev(),
        })}
        {arrowRender({
          orientation: 'right',
          onClick: scrollByPage ? nextPage : () => next(),
        })}
      </Fragment>
    )
    return ArrowsContainerComponent ? (
      <ArrowsContainerComponent>{arrows}</ArrowsContainerComponent>
    ) : (
      arrows
    )
  }

  const renderChild = child =>
    React.cloneElement(child, {
      style: {
        ...(child.props.style ? child.props.style : {}),
        width: `${100 / totalSlides}%`,
      },
    })

  const isMultiPage = useMemo(() => childrenLength > perPage, [
    childrenLength,
    perPage,
  ])

  const shouldAddClones = useMemo(() => {
    return !firstRender && props.loop && isMultiPage
  }, [firstRender])

  const classes = {
    ...Slider.defaultProps.classes,
    ...props.classes,
  }

  const arrayChildren = React.Children.toArray(props.children)

  /*const sliderFrameWidth =
    perPage < childrenLength || firstRender
      ? (100 * totalSlides) / perPage
      : 100*/

  const sliderFrameStyle = {
    width: `${
      perPage < childrenLength || firstRender
        ? (100 * totalSlides) / perPage
        : 100
    }%`,
    ...(isMultiPage &&
      getTranslateProperty(
        (props.currentSlide / totalSlides) * -100 + dragDistance
      )),
    ...getStylingTransition(
      props.easing,
      enableTransition ? props.duration : 0
    ),
    ...(isMultiPage && { cursor: props.cursor }),
  }

  return (
    <Fragment>
      {isMultiPage && renderArrows()}
      <RootTag
        className={classnames(classes.root, 'overflow-hidden h-100')}
        ref={selectorRef}
        {...isMultiPage} //Set events
      >
        <EventListener target="window" onResize={handleResize} />
        <SliderFrameTag
          className={classnames(
            classes.sliderFrame,
            styles.sliderFrame,
            'list pa0 h-100 ma0 flex'
          )}
          style={sliderFrameStyle}
          ref={sliderFrameRef}
        >
          {shouldAddClones &&
            React.Children.map(
              arrayChildren.slice(
                props.children.length - perPage,
                props.children.length
              ),
              renderChild
            )}
          {React.Children.map(arrayChildren, renderChild)}
          {shouldAddClones &&
            React.Children.map(arrayChildren.slice(0, perPage), renderChild)}
        </SliderFrameTag>
      </RootTag>
    </Fragment>
  )
}

Slider.propTypes = {
  /** A render function that will receive as props an orientation prop
   * and a onClick callback */
  arrowRender: PropTypes.func,
  /** The component used to contain both arrows.
   * Either a string to use a DOM element or a component.
   */
  arrowsContainerComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  /** The slides to render */
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
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
  /** If the slides should be looping */
  loop: PropTypes.bool,
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
  /** If should scroll by page or one item at a time */
  scrollByPage: PropTypes.bool,
}

Slider.defaultProps = {
  classes: {
    root: '',
    sliderFrame: '',
  },
  currentSlide: 0,
  cursor: 'default',
  cursorOnMouseDown: 'default',
  draggable: false,
  duration: 250,
  easing: 'ease-out',
  loop: false,
  perPage: 1,
  resizeDebounce: constants.defaultResizeDebounce,
  rootTag: 'div',
  showArrows: false,
  sliderFrameTag: 'ul',
  threshold: 50,
  scrollByPage: false,
}

export default Slider
