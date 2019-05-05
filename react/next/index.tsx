import React, { FC, useState, useEffect, useRef } from 'react'

import { SliderInternalState, SliderProps } from './typings'
import {
  getInitialState,
  throwError,
  getItemClientSideWidth,
  populateNextSlides,
  populatePreviousSlides,
} from './utils/index'
import Dots from './Dots'
import Arrow from './Arrow'
import Slides from './Slides'
import SliderTrack from './SliderTrack'

/**
 * Slider's main component
 */
const SliderNext: FC<SliderProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<SliderInternalState>({
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
    const setNewState = (shouldCorrectItemPosition: boolean) => {
      const { responsive } = props
      Object.keys(responsive).forEach(item => {
        const { breakpoint, items } = responsive[item]
        const { max, min } = breakpoint
        if (window.innerWidth >= min && window.innerWidth <= max) {
          if (containerRef && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth
            const itemWidth: number = getItemClientSideWidth(
              items,
              containerWidth
            )
            setState({
              ...state,
              domLoaded: true,
              slidesToShow: items,
              deviceType: item,
              containerWidth,
              itemWidth,
              transform: shouldCorrectItemPosition
                ? -itemWidth * state.currentSlide
                : state.transform,
            })
          } else {
            setState({
              ...state,
              domLoaded: true,
              slidesToShow: items,
              deviceType: item,
            })
          }
        }
      })
    }

    const onResize = (value?: any): void => {
      setNewState(!(value && !props.infinite))
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

  const next = (slidesHavePassed = 0) => {
    const { nextSlides, nextPosition } = populateNextSlides(
      state,
      props,
      slidesHavePassed
    )
    if (nextSlides === undefined || nextPosition === undefined) {
      return
    }
    setState({
      ...state,
      transform: nextPosition,
      currentSlide: nextSlides,
    })
  }

  const previous = (slidesHavePassed = 0) => {
    const { nextSlides, nextPosition } = populatePreviousSlides(
      state,
      props,
      slidesHavePassed
    )
    if (nextSlides === undefined || nextPosition === undefined) {
      // they can be 0, which goes back to the first slide.
      return
    }
    setState({
      ...state,
      transform: nextPosition,
      currentSlide: nextSlides,
    })
  }

  const goToSlide = (slide: number): void => {
    const { itemWidth } = state
    setState({
      ...state,
      currentSlide: slide,
      transform: -(itemWidth * slide),
    })
  }

  const renderLeftArrow = (): React.ReactNode => {
    const { customLeftArrow } = props
    return (
      <Arrow
        custom={customLeftArrow}
        direction="left"
        getState={() => getState()}
        action={previous}
      />
    )
  }

  const renderRightArrow = (): React.ReactNode => {
    const { customRightArrow } = props
    return (
      <Arrow
        custom={customRightArrow}
        getState={() => getState()}
        direction="right"
        action={next}
      />
    )
  }

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

  const { shouldRenderOnSSR } = getInitialState(state, props)
  const isLeftEndReach = !(state.currentSlide - props.slidesToSlide! >= 0)
  const isRightEndReach = !(
    state.currentSlide + 1 + state.slidesToShow <=
    state.totalItems
  )

  const shouldShowArrows =
    props.showArrows &&
    !(
      props.removeArrowOnDeviceType &&
      ((props.deviceType &&
        props.removeArrowOnDeviceType.indexOf(props.deviceType) > -1) ||
        (state.deviceType &&
          props.removeArrowOnDeviceType.indexOf(state.deviceType) > -1))
    )

  const disableLeftArrow = !props.infinite && isLeftEndReach
  const disableRightArrow = !props.infinite && isRightEndReach

  /**
   * Points props inconsistencies
   */
  throwError(props)

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
        shouldRenderOnSSR={shouldRenderOnSSR}
      >
        <Slides state={state} props={props} />
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
}

export default SliderNext
