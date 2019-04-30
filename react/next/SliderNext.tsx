import * as React from 'react'

import {
  throttle,
  getInitialState,
  throwError,
  getItemClientSideWidth,
  populateNextSlides,
  populatePreviousSlides,
} from './utils/index'

import { SliderList, SliderTrack } from './Styled'
import { SliderInternalState, SliderProps } from './types'
import Dots from './Dots'
import { LeftArrow, RightArrow } from './Arrows'
import Slides from './Slides'

const defaultTransitionDuration = 400
const defaultTransition = 'transform 400ms ease-in-out'

class SliderNext extends React.Component<SliderProps, SliderInternalState> {
  static defaultProps = {
    slidesToSlide: 1,
    infinite: false,
    draggable: true,
    swipeable: true,
    arrows: true,
    containerClass: '',
    sliderClass: '',
    itemClass: '',
    autoPlaySpeed: 3000,
    showDots: false,
    minimumTouchDrag: 80,
    dotListClass: '',
    focusOnSelect: false,
  }

  /**
   * Declarations
   */
  private readonly containerRef: React.RefObject<any>
  public initialPosition: number
  public lastPosition: number
  public isAnimationAllowed: boolean
  public autoPlay?: any
  public isInThrottle?: boolean

  /** Bindings and init */
  constructor(props: SliderProps) {
    super(props)
    this.containerRef = React.createRef()
    this.state = {
      itemWidth: 0,
      slidesToShow: 0,
      currentSlide: 0,
      totalItems: React.Children.count(props.children),
      deviceType: '',
      domLoaded: false,
      transform: 0,
      containerWidth: 0,
      isSliding: false,
    }

    this.setIsInThrottle = this.setIsInThrottle.bind(this)

    this.next = throttle(
      this.next.bind(this),
      props.transitionDuration || defaultTransitionDuration,
      this.setIsInThrottle
    )

    this.previous = throttle(
      this.previous.bind(this),
      props.transitionDuration || defaultTransitionDuration,
      this.setIsInThrottle
    )

    this.goToSlide = throttle(
      this.goToSlide.bind(this),
      props.transitionDuration || defaultTransitionDuration,
      this.setIsInThrottle
    )

    this.initialPosition = 0
    this.lastPosition = 0
    this.isAnimationAllowed = false
    this.isInThrottle = false
  }

  componentDidMount(): void {
    this.setState({ domLoaded: true })
    this.setItemsToShow()
    window.addEventListener('resize', this.onResize)
    this.onResize(true)
    if (this.props.autoPlay && this.props.autoPlaySpeed) {
      this.autoPlay = setInterval(this.next, this.props.autoPlaySpeed)
    }
  }

  componentDidUpdate(
    { autoPlay }: SliderProps,
    { containerWidth, domLoaded, isSliding }: SliderInternalState
  ): void {
    if (
      this.containerRef &&
      this.containerRef.current &&
      this.containerRef.current.offsetWidth !== containerWidth
    ) {
      // this is for handing resizing only.
      setTimeout(() => {
        this.setItemsToShow(true)
      }, this.props.transitionDuration || defaultTransitionDuration)
    }
    if (autoPlay && !this.props.autoPlay && this.autoPlay) {
      clearInterval(this.autoPlay)
      this.autoPlay = undefined
    }
    if (!autoPlay && this.props.autoPlay && !this.autoPlay) {
      this.autoPlay = setInterval(this.next, this.props.autoPlaySpeed)
    }
    if (this.props.infinite) {
      // this is to quickly cancel the animation and move the items position to create the infinite effects.
      // TODO
    }
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.onResize)
    if (this.props.autoPlay && this.autoPlay) {
      clearInterval(this.autoPlay)
      this.autoPlay = undefined
    }
  }

  /**
   * Sets whatever is in throttle or not
   * @param isInThrottle
   */
  setIsInThrottle(isInThrottle: boolean = false): void {
    this.isInThrottle = isInThrottle
  }

  setItemsToShow(shouldCorrectItemPosition?: boolean): void {
    const { responsive } = this.props
    Object.keys(responsive).forEach(item => {
      const { breakpoint, items } = responsive[item]
      const { max, min } = breakpoint
      if (window.innerWidth >= min && window.innerWidth <= max) {
        this.setState({ slidesToShow: items, deviceType: item })
        this.setContainerAndItemWidth(items, shouldCorrectItemPosition)
      }
    })
  }

  // this is for resizing only or the first time when we entered client-side from server-side.
  setContainerAndItemWidth(
    slidesToShow: number,
    shouldCorrectItemPosition?: boolean
  ): void {
    if (this.containerRef && this.containerRef.current) {
      const containerWidth = this.containerRef.current.offsetWidth
      const itemWidth: number = getItemClientSideWidth(
        this.props,
        slidesToShow,
        containerWidth
      )
      this.setState(
        {
          containerWidth,
          itemWidth,
        },
        () => {
          if (this.props.infinite) {
            //TODO
          }
        }
      )
      if (shouldCorrectItemPosition) {
        this.correctItemsPosition(itemWidth)
      }
    }
  }

  correctItemsPosition(itemWidth: number, isAnimationAllowed?: boolean): void {
    /*
        For swipe, drag and resizing, they changed the position of the carousel, but the position are not always correct.
        Hence, this is to make sure our items are in the correct place.
        */
    if (isAnimationAllowed) {
      this.isAnimationAllowed = true
    }
    if (!isAnimationAllowed && this.isAnimationAllowed) {
      this.isAnimationAllowed = false
    }
    this.setState({
      transform: -(itemWidth * this.state.currentSlide),
    })
  }

  onResize = (value?: any): void => {
    const { infinite } = this.props
    let shouldCorrectItemPosition
    if (!infinite) {
      shouldCorrectItemPosition = false
    } else {
      if (typeof value === 'boolean' && value) {
        shouldCorrectItemPosition = false
      } else {
        shouldCorrectItemPosition = true
      }
    }
    this.setItemsToShow(shouldCorrectItemPosition)
  }

  next(slidesHavePassed = 0): void {
    const { afterChange, beforeChange } = this.props
    /*
        two cases:
        1. We are not over-sliding.
        2. We are sliding over to what we have, that means nextslides > this.props.children.length. (does not apply to the inifnite mode)
        */
    const { nextSlides, nextPosition } = populateNextSlides(
      this.state,
      this.props,
      slidesHavePassed
    )
    const previousSlide = this.state.currentSlide
    if (nextSlides === undefined || nextPosition === undefined) {
      // they can be 0.
      return
    }
    if (typeof beforeChange === 'function') {
      beforeChange(nextSlides, this.getState())
    }
    this.isAnimationAllowed = true
    this.setState(
      {
        isSliding: true,
        transform: nextPosition,
        currentSlide: nextSlides,
      },
      () => {
        this.setState({ isSliding: false })
        if (typeof afterChange === 'function') {
          setTimeout(() => {
            afterChange(previousSlide, this.getState())
          }, this.props.transitionDuration || defaultTransitionDuration)
        }
      }
    )
  }

  previous(slidesHavePassed = 0): void {
    const { afterChange, beforeChange } = this.props
    const { nextSlides, nextPosition } = populatePreviousSlides(
      this.state,
      this.props,
      slidesHavePassed
    )
    if (nextSlides === undefined || nextPosition === undefined) {
      // they can be 0, which goes back to the first slide.
      return
    }
    const previousSlide = this.state.currentSlide
    if (typeof beforeChange === 'function') {
      beforeChange(nextSlides, this.getState())
    }
    this.isAnimationAllowed = true
    this.setState(
      {
        isSliding: true,
        transform: nextPosition,
        currentSlide: nextSlides,
      },
      () => {
        this.setState({ isSliding: false })
        if (typeof afterChange === 'function') {
          setTimeout(() => {
            afterChange(previousSlide, this.getState())
          }, this.props.transitionDuration || defaultTransitionDuration)
        }
      }
    )
  }

  handleDown = (e: any): void => {
    //TODO Mouse DOWN! Implement drag and swipe!
  }

  handleMove = (e: any): void => {
    //TODO Mouse MOVE! Implement drag and swipe!
  }

  handleOut = (e: any): void => {
    if (this.props.autoPlay && !this.autoPlay) {
      this.autoPlay = setInterval(this.next, this.props.autoPlaySpeed)
    }
    //TODO Mouse OUT! Implement drag and swipe!
  }

  handleEnter = (): void => {
    if (this.autoPlay && this.props.autoPlay) {
      clearInterval(this.autoPlay)
      this.autoPlay = undefined
    }
    //TODO Mouse ENTER! Implement drag and swipe!
  }

  goToSlide(slide: number): void {
    if (this.isInThrottle) {
      return
    }
    const { itemWidth } = this.state
    const { afterChange, beforeChange } = this.props
    const previousSlide = this.state.currentSlide
    if (typeof beforeChange === 'function') {
      beforeChange(slide, this.getState())
    }
    this.isAnimationAllowed = true
    this.setState(
      {
        currentSlide: slide,
        transform: -(itemWidth * slide),
      },
      () => {
        if (this.props.infinite) {
          //TODO
        }
        if (typeof afterChange === 'function') {
          setTimeout(() => {
            afterChange(previousSlide, this.getState())
          }, this.props.transitionDuration || defaultTransitionDuration)
        }
      }
    )
  }

  getState(): any {
    return {
      ...this.state,
    }
  }

  renderLeftArrow(): React.ReactNode {
    const { customLeftArrow } = this.props
    return (
      <LeftArrow
        customLeftArrow={customLeftArrow}
        getState={() => this.getState()}
        previous={this.previous}
      />
    )
  }

  renderRightArrow(): React.ReactNode {
    const { customRightArrow } = this.props
    return (
      <RightArrow
        customRightArrow={customRightArrow}
        getState={() => this.getState()}
        next={this.next}
      />
    )
  }

  renderDotsList(): React.ReactElement<any> | null {
    return (
      <Dots
        state={this.state}
        props={this.props}
        goToSlide={this.goToSlide}
        getState={() => this.getState()}
      />
    )
  }

  public render(): React.ReactNode {
    const { slidesToShow } = this.state

    const {
      deviceType,
      slidesToSlide,
      arrows,
      removeArrowOnDeviceType,
      infinite,
      containerClass,
      sliderClass,
      customTransition,
    } = this.props

    throwError(this.state, this.props)

    const { shouldRenderOnSSR } = getInitialState(this.state, this.props)
    const isLeftEndReach = !(this.state.currentSlide - slidesToSlide! >= 0)
    const isRightEndReach = !(
      this.state.currentSlide + 1 + slidesToShow <=
      this.state.totalItems
    )
    const shouldShowArrows =
      arrows &&
      !(
        removeArrowOnDeviceType &&
        ((deviceType && removeArrowOnDeviceType.indexOf(deviceType) > -1) ||
          (this.state.deviceType &&
            removeArrowOnDeviceType.indexOf(this.state.deviceType) > -1))
      )
    const disableLeftArrow = !infinite && isLeftEndReach
    const disableRightArrow = !infinite && isRightEndReach

    return (
      <SliderList className={containerClass} ref={this.containerRef}>
        <SliderTrack
          className={sliderClass}
          transition={
            this.isAnimationAllowed
              ? customTransition || defaultTransition
              : 'none'
          }
          shouldRenderOnSSR={shouldRenderOnSSR}
          transform={this.state.transform}
          onMouseMove={this.handleMove}
          onMouseDown={this.handleDown}
          onMouseUp={this.handleOut}
          onMouseEnter={this.handleEnter}
          onMouseLeave={this.handleOut}
          onTouchStart={this.handleDown}
          onTouchMove={this.handleMove}
          onTouchEnd={this.handleOut}
        >
          <Slides state={this.state} props={this.props} />
        </SliderTrack>
        {shouldShowArrows && !disableLeftArrow && this.renderLeftArrow()}
        {shouldShowArrows && !disableRightArrow && this.renderRightArrow()}
        {this.renderDotsList()}
      </SliderList>
    )
  }
}

export default SliderNext
