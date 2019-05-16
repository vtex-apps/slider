import React from 'react'

import Slide from './Slide'

interface Props {
  itemWidth: number
  currentSlide: number
  slidesToShow: number
  children: any
  classNames?: {
    item?: string
  }
  totalItems: number
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
  const {
    children,
    classNames,
    itemWidth,
    currentSlide,
    slidesToShow,
    totalItems,
  } = props

  return React.Children.toArray(children).map((child, index) => (
    <Slide
      key={index}
      data-index={index}
      width={itemWidth}
      className={classNames!.item}
      aria-hidden={
        getIfSlideIsVisbile(index, currentSlide, slidesToShow)
          ? 'false'
          : 'true'
      }
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${totalItems}`}
    >
      {child}
    </Slide>
  ))
}

export default SlideList
