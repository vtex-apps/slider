import React from 'react'

import Slide from './Slide'

interface Props {
  itemWidth: number
  currentSlide: number
  slidesToShow: number
  children: any
  itemClass?: string
}

/**
 * Returns if the slide is visible or not
 */
const getIfSlideIsVisbile = (
  index: number,
  currentSlide: number,
  slidesToShow: number
): boolean => {
  return index >= currentSlide && index < currentSlide + slidesToShow
}

/** List of all slides */
const SlideList = (props: Props): any => {
  const { children, itemClass, itemWidth, currentSlide, slidesToShow } = props

  return React.Children.toArray(children).map((child, index) => (
    <Slide
      key={index}
      data-index={index}
      aria-hidden={
        getIfSlideIsVisbile(index, currentSlide, slidesToShow)
          ? 'false'
          : 'true'
      }
      width={itemWidth}
      className={itemClass}
    >
      {child}
    </Slide>
  ))
}

export default SlideList
