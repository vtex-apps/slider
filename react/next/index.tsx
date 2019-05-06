import React, { FC, useReducer, useEffect, useRef } from 'react'

import { SliderProps } from './typings/global'
import {
  getInitialState,
  throwError,
  getItemClientSideWidth,
  populateNextSlides,
  populatePreviousSlides,
} from './utils/index'

import Dots from './components/Dots'
import Arrow from './components/Arrow'
import Slides from './components/Slides'
import SliderTrack from './components/SliderTrack'
import reducer from './stateReducer'

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
    dispatch({
      type: 'slide',
      payload: {
        transform: nextPosition,
        currentSlide: nextSlides,
      },
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
    dispatch({
      type: 'slide',
      payload: {
        transform: nextPosition,
        currentSlide: nextSlides,
      },
    })
  }

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
