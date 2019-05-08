import React from 'react'

interface responsiveType {
  [key: string]: {
    breakpoint: { max: number; min: number }
    items: number
  }
}

interface transitionType {
  /** Transition speed in ms */
  speed: number
  /** Transition delay in ms */
  delay: number
  /** Timing function */
  timing: string
}

interface SliderProps {
  /** Device type */
  deviceType?: string
  /** Number of elements per breakpoint when on SSR */
  ssr?: responsiveType
  /** Number of slides that are passed each time */
  slidesToSlide?: number
  /** Pass all the visible slides */
  slideVisibleSlides?: boolean
  /** Elements to render  */
  children: any
  /** If should show arrows */
  showArrows?: boolean
  /** Which device types that arrows should be hidden */
  removeArrowOnDeviceType?: string | string[]
  /** Custom arrow on left */
  customLeftArrow?: ComponentType<any> | null
  /** Custom arrow on right */
  customRightArrow?: ComponentType<any> | null
  /** Whatever is infinite mode or not */
  infinite?: boolean // TODO
  /** Custom class for slider */
  sliderClass?: string
  /** Custom class for items */
  itemClass?: string
  /** Custom class for left arrow */
  leftArrowClass?: string
  /** Custom class for right arrow */
  rightArrowClass?: string
  /** Custom class for container */
  containerClass?: string
  /** Custom class for dot list */
  dotListClass?: string
  /** Custom classes for a single dot */
  dotClass?: string
  /** If should show dots or not */
  showDots?: boolean
  /** Custom transition */
  transition?: transitionType
}

interface SliderState {
  /** Width of each item */
  itemWidth: number
  /** Width of the full container */
  containerWidth: number
  /** Number of slides to show per page */
  slidesToShow: number
  /** Index of the first item (left) of the current page */
  currentSlide: number
  /** Total number of slides */
  totalItems: number
  /** If the dom is loaded or not */
  domLoaded: boolean
  /** Current device type (based on containerWidth and responsive prop) */
  deviceType?: string
  /** Current transform value */
  transform: number
}
