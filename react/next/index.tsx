import React, { FC, useState, useEffect, useRef } from 'react'
import { useSpring, animated, config as springPresets } from 'react-spring'

import { SliderInternalState, SliderProps } from './types'

import {
  getInitialState,
  throwError,
  getItemClientSideWidth,
  populateNextSlides,
  populatePreviousSlides,
} from './utils/index'

import Dots from './Dots'
import { LeftArrow, RightArrow } from './Arrows'
import Slides from './Slides'

const SliderNext: FC<SliderProps> = props => {
  const [state, setState] = useState<SliderInternalState>({
    itemWidth: 0,
    slidesToShow: 0,
    currentSlide: 0,
    totalItems: React.Children.count(props.children),
    deviceType: '',
    domLoaded: false,
    transform: 0,
    containerWidth: 0,
    isSliding: false,
  })

  const containerRef = useRef<HTMLDivElement>(null)

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
      if (!props.infinite) {
        setNewState(false)
      } else {
        if (typeof value === 'boolean' && value) {
          setNewState(false)
        } else {
          setNewState(true)
        }
      }
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
    console.log('gotcha')
    const { nextSlides, nextPosition } = populateNextSlides(
      state,
      props,
      slidesHavePassed
    )
    if (nextSlides === undefined || nextPosition === undefined) {
      console.log('out undefined')
      return
    }
    console.log('nextTransform', nextPosition)
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
      <LeftArrow
        customLeftArrow={customLeftArrow}
        getState={() => getState()}
        previous={previous}
      />
    )
  }

  const renderRightArrow = (): React.ReactNode => {
    const { customRightArrow } = props
    return (
      <RightArrow
        customRightArrow={customRightArrow}
        getState={() => getState()}
        next={next}
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

  throwError(state, props)

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

  const animationStyle = useSpring({
    config: springPresets.default,
    transform: `translate3d(${state.transform}px, 0, 0)`,
  })

  return (
    <div
      className={`${
        props.containerClass
      } flex items-center relative overflow-hidden`}
      ref={containerRef}
    >
      <animated.div
        className={`${props.sliderClass} flex relative pa0 ma0`}
        style={animationStyle}
      >
        <Slides state={state} props={props} />
      </animated.div>
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
  autoPlaySpeed: 3000,
  showDots: false,
  dotListClass: '',
  slideVisibleSlides: false,
}

export default SliderNext
