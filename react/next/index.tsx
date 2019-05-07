import React, { FC, useReducer, useRef, useMemo, useEffect } from 'react'

import { SliderProps } from './typings/global'
import {
  getInitialState,
  getItemClientSideWidth,
  populateNextSlides,
  populatePreviousSlides,
} from './utils/index'

import Dots from './components/Dots'
import Arrow from './components/Arrow'
import SliderTrack from './components/SliderTrack'
import reducer from './stateReducer'
import SlideList from './components/Slides'

/**
 * Slider's main component
 */
const SliderNext: FC<SliderProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, dispatch] = useReducer(reducer, {
    itemWidth: 0,
    slidesToShow: 0,
    currentSlide: 0,
    totalItems: React.Children.count(props.children),
    deviceType: '',
    domLoaded: false,
    transform: 0,
    containerWidth: 0,
  })

  useEffect(() => {
    /**
     * Sets the state based on ssr's prop breakpoints
     * @param shouldCorrectItemPosition : If should correct item and container width
     */
    const setNewState = (shouldCorrectItemPosition: boolean) => {
      const { ssr } = props
      ssr &&
        Object.keys(ssr).forEach(item => {
          const { breakpoint, items } = ssr[item]
          const { max, min } = breakpoint
          if (window.innerWidth >= min && window.innerWidth <= max) {
            if (containerRef && containerRef.current) {
              const containerWidth = containerRef.current.offsetWidth
              const itemWidth: number = getItemClientSideWidth(
                items,
                containerWidth
              )
              dispatch({
                type: 'loadAndCorrect',
                payload: {
                  slidesToShow: items,
                  deviceType: item,
                  containerWidth,
                  itemWidth,
                  shouldCorrectItemPosition,
                },
              })
            } else {
              dispatch({
                type: 'load',
                payload: {
                  slidesToShow: items,
                  deviceType: item,
                },
              })
            }
          }
        })
    }

    /** 
     * On resize screen the function setNewState will be called
     * The container and item will be corrected if there is no value(e) or is infinite mode
     */
    const onResize = (value?: any): void => {
      setNewState(!value || props.infinite!)
    }

    setNewState(false)

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const getState = (): any => {
    return {
      ...state,
    }
  }

  /** Common function that allows to slide to previous or next slides */
  const slide = (transform: number, currentSlide: number) => {
    dispatch({
      type: 'slide',
      payload: {
        transform: transform,
        currentSlide: currentSlide,
      },
    })
  }

  /** Go to next slides */
  const next = (slidesHavePassed = 0) => {
    const { nextSlides, nextPosition } = populateNextSlides(
      state,
      props,
      slidesHavePassed
    )
    slide(nextPosition!, nextSlides!)
  }

  /** Go to previous slides */
  const previous = (slidesHavePassed = 0) => {
    const { nextSlides, nextPosition } = populatePreviousSlides(
      state,
      props,
      slidesHavePassed
    )
    slide(nextPosition!, nextSlides!)
  }

  /** Go to any slide by index */
  const goToSlide = (slide: number): void => {
    const { itemWidth } = state
    dispatch({
      type: 'slide',
      payload: {
        transform: -(itemWidth * slide),
        currentSlide: slide,
      },
    })
  }

  /** Renders left arrow */
  const renderLeftArrow = (): React.ReactNode => {
    const { customLeftArrow } = props
    return (
      <Arrow
        custom={customLeftArrow}
        orientation="left"
        getState={() => getState()}
        action={previous}
      />
    )
  }

  /** Renders right arrow */
  const renderRightArrow = (): React.ReactNode => {
    const { customRightArrow } = props
    return (
      <Arrow
        custom={customRightArrow}
        getState={() => getState()}
        orientation="right"
        action={next}
      />
    )
  }

  /** Renders the Dots */
  const renderDotsList = (): React.ReactElement<any> | null => {
    return (
      <Dots
        state={state}
        props={props}
        goToSlide={goToSlide}
        getState={() => getState()}
      />
    )
  }

  /** Reached left end */
  const isLeftEndReach = useMemo(() => !(state.currentSlide - props.slidesToSlide! >= 0), [state.currentSlide, props.slidesToSlide])

  /** Reached right end */
  const isRightEndReach = useMemo(() => !(
    state.currentSlide + 1 + state.slidesToShow <=
    state.totalItems
  ), [state.currentSlide, state.slidesToShow, state.totalItems])

  const { shouldRenderOnSSR } = getInitialState(state, props)

  /** If should arrows or not, filtering for specific device types */
  const shouldShowArrows = useMemo(() => props.showArrows &&
    !(
      props.removeArrowOnDeviceType &&
      ((props.deviceType &&
        props.removeArrowOnDeviceType.indexOf(props.deviceType) > -1) ||
        (state.deviceType &&
          props.removeArrowOnDeviceType.indexOf(state.deviceType) > -1))
    ), [props.showArrows, props.removeArrowOnDeviceType, props.deviceType, state.deviceType])

  /** Disable left arrow if is not inifite and reached left end */
  const disableLeftArrow = !props.infinite && isLeftEndReach

  /** Disable right arrow if is not infinite and reached rigth end */
  const disableRightArrow = !props.infinite && isRightEndReach

  return (
    <div
      className={`${
        props.containerClass
        } flex items-center relative overflow-hidden`}
      ref={containerRef}
    >
      <SliderTrack
        className={props.sliderClass}
        transform={state.transform}
        transition={props.transition!}
        shouldRenderOnSSR={shouldRenderOnSSR}
      >
        <SlideList state={state} props={props} />
      </SliderTrack>
      {shouldShowArrows && !disableLeftArrow && renderLeftArrow()}
      {shouldShowArrows && !disableRightArrow && renderRightArrow()}
      {renderDotsList()}
    </div>
  )
}

SliderNext.defaultProps = {
  slidesToSlide: 1,
  infinite: false,
  showArrows: true,
  containerClass: '',
  sliderClass: '',
  itemClass: '',
  showDots: false,
  dotListClass: '',
  slideVisibleSlides: false,
  transition: {
    speed: 400,
    delay: 0,
    timing: 'ease-in-out'
  }
}

export default SliderNext
