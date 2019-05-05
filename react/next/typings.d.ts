import React from 'react'

interface responsiveType {
  [key: string]: {
    breakpoint: { max: number; min: number }
    items: number
  }
}

interface SliderProps {
  /** Number of elements per breakpoint */
  responsive: responsiveType
  /** Device type */
  deviceType?: string
  /** If is on SSR */
  ssr?: boolean
  /** Number of slides that are passed each time */
  slidesToSlide?: number
  /** Pass all the visible slides */
  slideVisibleSlides?: boolean
  /** Elements to render  */
  children: any
  /** If should show arrows */
  showArrows?: boolean
  /** Which device types that arrows should be hidden */
  removeArrowOnDeviceType?: string | Array<string>
  /** Custom arrow on left */
  customLeftArrow?: React.ReactElement<any> | null
  /** Custom arrow on right */
  customRightArrow?: React.ReactElement<any> | null
  /** Custom dots */
  customDot?: React.ReactElement<any> | null
  /** Whatever is infinite mode or not */
  infinite?: boolean // TODO
  /** Custom class for slider */
  sliderClass?: string
  /** Custom class for items */
  itemClass?: string
  /** Custom class for container */
  containerClass?: string
  /** Custom class for dots */
  dotListClass?: string
  /** If should show dots or not */
  showDots?: boolean
}

type StateCallBack = () => SliderState

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
