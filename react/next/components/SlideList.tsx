import React from 'react'

import { getIfSlideIsVisbile } from '../utils/index'
import Slide from './Slide'

interface Props {
  itemWidth: number
  currentSlide: number
  slidesToShow: number
  children: any
  itemClass?: string
}

/** List of all slides */
const SlideList = (props: Props): any => {
  const { children, itemClass, itemWidth, currentSlide, slidesToShow } = props

  return React.Children.toArray(children).map((child, index) => (
    <Slide
      key={index}
      data-index={index}
      aria-hidden={getIfSlideIsVisbile(index, currentSlide, slidesToShow) ? 'false' : 'true'}
      width={itemWidth}
      className={itemClass}
    >
      {child}
    </Slide>
  ))
}

export default SlideList
