import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ButtonHTMLAttributes,
} from 'react'

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

interface Thumbnail {
  /** Url of the thumbnail */
  url: string
  /** Slide that it refers to */
  forSlide: number
}

interface SliderProps {
  /** Aria label of slider */
  label?: string
  /** Device type */
  deviceType?: string
  /** Element props */
  elements: {
    /** Number of visible elements per breakpoint */
    visible: responsiveType
    /** Number of elements that are passed each time 1 to visible */
    toPass?: number | 'visible'
  }
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
  infinite?: boolean
  /** Custom classes */
  classNames?: {
    container?: string
    sliderContainer?: string
    slider?: string
    item?: string
    leftArrow?: string
    rightArrow?: string
    dotList?: string
    dot?: string
    thumbnails?: string
    thumbnail?: string
    selectedThumbnail?: string
  }
  /** If should show dots or not */
  showDots?: boolean
  /** Custom transition */
  transition?: transitionType
  /** Thumbnails props */
  thumbnails?: {
    /** Array of thumbnails */
    items: Array<Thumbnail>
    /** Thumbs position relative to slider container */
    position: 'right' | 'left'
    /** Thumbs width with measure (px, em, rem %, ...) */
    width: string
  }
  /** Props for autoplay */
  autoplay?: {
    /** Time duration in ms */
    timeout: number
    /** If should stop the timeout by hovering the slide */
    stopOnHover?: boolean
  }
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

/** Shorten for Div */
interface Div
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

interface Button
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}
