import React, { FC, useReducer, useRef, useEffect } from 'react'
import csx from 'classnames'

import { SliderProps } from './typings/global'
import { getItemClientSideWidth, populateSlides } from './utils/index'

import Dots from './components/Dots'
import Arrow from './components/Arrow'
import SliderTrack from './components/SliderTrack'
import reducer from './stateReducer'
import SlideList from './components/SlideList'
import Thumbnails from './components/Thumbnails'
import useControlledTimeout from './hooks/useControlledTimeout'
import useHovering from './hooks/useHovering'
import useKeyboardArrows from './hooks/useKeyboardArrows'

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

  /** Transform Label Text => label-text-items */
  const itemsId: string = `${props
    .label!.toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  useEffect(() => {
    /**
     * Sets the state based on ssr's prop breakpoints
     * @param shouldCorrectItemPosition : If should correct item and container width
     */
    const setNewState = (shouldCorrectItemPosition: boolean) => {
      const {
        elements: { visible },
      } = props
      visible &&
        Object.keys(visible).forEach(item => {
          const { breakpoint, items } = visible[item]
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
  }, [props])

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

  /** Populate slides for next or prev */
  const populate = (order: 'next' | 'prev') => {
    const { nextSlides, nextPosition } = populateSlides(
      order,
      state.currentSlide,
      state.slidesToShow,
      state.itemWidth,
      state.totalItems,
      props.elements!.toPass!,
      props.infinite!
    )
    slide(nextPosition!, nextSlides!)
  }

  const { isHovering } = useHovering(containerRef)
  props.autoplay &&
    useControlledTimeout(
      props.autoplay!.timeout,
      () => populate('next'),
      props.autoplay!.stopOnHover! && isHovering,
      [state.currentSlide]
    )

  /** Populate next slides */
  const next = () => {
    populate('next')
  }

  /** Populate previous slides */
  const prev = () => {
    populate('prev')
  }

  props.keyboardControlled &&
    useKeyboardArrows(prev, next, [state.domLoaded, state.currentSlide])

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
    const { customLeftArrow, classNames } = props
    const { toPass } = props.elements
    const isLeftEndReach = !(
      state.currentSlide - (toPass! === 'visible' ? 1 : toPass!) >=
      0
    )

    /** Disable left arrow if is not inifite and reached left end */
    const disabled = !props.infinite && isLeftEndReach

    return (
      <Arrow
        controls={itemsId}
        className={classNames!.leftArrow}
        custom={customLeftArrow}
        orientation="left"
        action={prev}
        disabled={disabled}
      />
    )
  }

  /** Renders right arrow */
  const renderRightArrow = (): React.ReactNode => {
    const { customRightArrow, classNames } = props
    const isRightEndReach = !(
      state.currentSlide + 1 + state.slidesToShow <=
      state.totalItems
    )

    /** Disable right arrow if is not infinite and reached rigth end */
    const disabled = !props.infinite && isRightEndReach

    return (
      <Arrow
        controls={itemsId}
        className={classNames!.leftArrow}
        custom={customRightArrow}
        orientation="right"
        action={next}
        disabled={disabled}
      />
    )
  }

  /** Renders the Dots */
  const renderDotsList = (): React.ReactNode => {
    return (
      <Dots {...state} {...props} goToSlide={goToSlide} controls={itemsId} />
    )
  }

  const renderThumbnails = (): React.ReactNode => {
    return (
      <Thumbnails
        {...state}
        {...props}
        goToSlide={goToSlide}
        controls={itemsId}
      />
    )
  }

  /** If should arrows or not, filtering for specific device types */
  const shouldShowArrows =
    props.showArrows &&
    !(
      props.removeArrowOnDeviceType &&
      ((props.deviceType &&
        props.removeArrowOnDeviceType.indexOf(props.deviceType) > -1) ||
        (state.deviceType &&
          props.removeArrowOnDeviceType.indexOf(state.deviceType) > -1))
    )

  const hasThumbsleft = props.thumbnails && props.thumbnails.position === 'left'

  const containerClasses = csx(props.classNames!.sliderContainer, 'flex w-100')

  const sliderContainerClasses = csx(
    props.classNames!.sliderContainer,
    hasThumbsleft && 'order-1',
    'flex items-center relative overflow-hidden'
  )

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={props.label}
      className={containerClasses}
    >
      <div
        className={sliderContainerClasses}
        style={{
          width: props.thumbnails
            ? `calc(100% - ${props.thumbnails.width})`
            : `100%`,
        }}
        ref={containerRef}
      >
        <SliderTrack
          id={itemsId}
          className={props.classNames!.slider}
          transform={state.transform}
          transition={props.transition!}
        >
          <SlideList {...state} {...props} />
        </SliderTrack>
        {shouldShowArrows && renderLeftArrow()}
        {shouldShowArrows && renderRightArrow()}
        {props.showDots && renderDotsList()}
      </div>
      {props.thumbnails && renderThumbnails()}
    </section>
  )
}

SliderNext.defaultProps = {
  label: 'Carousel',
  elements: {
    visible: {
      every: {
        breakpoint: { max: 3840, min: 0 },
        items: 1,
      },
    },
    toPass: 1,
  },
  infinite: true,
  showArrows: true,
  showDots: true,
  classNames: {
    container: '',
    sliderContainer: '',
    slider: '',
    item: '',
    leftArrow: '',
    rightArrow: '',
    dotList: '',
    dot: '',
    thumbnails: '',
    thumbnail: '',
    selectedThumbnail: '',
  },
  transition: {
    speed: 400,
    delay: 0,
    timing: 'ease-in-out',
  },
  keyboardControlled: false,
}

export default SliderNext
