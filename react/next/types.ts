import * as React from 'react'
export interface responsiveType {
  [key: string]: {
    breakpoint: { max: number; min: number }
    items: number
    paritialVisibilityGutter?: number
  }
}
export interface SliderProps {
  /** Number of elements per breakpoint */
  responsive: responsiveType
  /** Device type */
  deviceType?: string
  /** If is on SSR */
  ssr?: boolean
  /** Number of slides that are passed each time */
  slidesToSlide?: number
  /** Elements to render  */
  children: any
  /** If should show arrows */
  showArrows?: boolean
  /** With device types that arrows should be hidden */
  removeArrowOnDeviceType?: string | Array<string>
  /** Custom arrow on left */
  customLeftArrow?: React.ReactElement<any> | null
  /** Custom arrow on right */
  customRightArrow?: React.ReactElement<any> | null
  /** Custom dots */
  customDot?: React.ReactElement<any> | null
  /** Whatever is infinite mode or not */
  infinite?: boolean // TODO
  /** Change callback after sliding everytime || (previousSlide, currentState) => ... */
  afterChange?: (previousSlide: number, state: stateCallBack) => void // `
  /** Change callback before sliding everytime || (previousSlide, currentState) => ... */
  beforeChange?: (nextSlide: number, state: stateCallBack) => void
  /** Custom class for slider */
  sliderClass?: string
  /** Custom class for items */
  itemClass?: string
  /** Custom class for container */
  containerClass?: string
  /** Custom class for dots */
  dotListClass?: string
  /** If should autoplay */
  autoPlay?: boolean
  /** Autoplay speed */
  autoPlaySpeed?: number
  /** If should show dots or not */
  showDots?: boolean
  /** Custom transitions */
  customTransition?: string
  /** Custom transition duration */
  transitionDuration?: number
}

export interface stateCallBack extends SliderInternalState {
  onMove: boolean
  direction: string | undefined
}

export interface buttonGroupProps {
  previous?: () => void
  next?: () => void
  goToSlide?: (index: number) => void
  carouselState?: stateCallBack
}
export interface ArrowProps {
  onClick?: () => void
  carouselState?: stateCallBack
}
export interface DotProps {
  index?: number
  active?: boolean
  onClick?: () => void
  carouselState?: stateCallBack
}

export interface SliderInternalState {
  itemWidth: number
  containerWidth: number
  slidesToShow: number
  currentSlide: number
  totalItems: number
  domLoaded: boolean
  deviceType?: string
  transform: number
  isSliding?: boolean
}
