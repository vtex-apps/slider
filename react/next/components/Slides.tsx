import React from 'react'

import { SliderState, SliderProps } from '../typings/global'
import { getInitialState, getIfSlideIsVisbile } from '../utils/index'
import Slide from './Slide'

interface Props {
  props: SliderProps
  state: SliderState
}

/** List of all slides */
const SlideList = ({ props, state }: Props): any => {
  const { itemWidth } = state
  const { children, itemClass } = props
  const { flexBasis, shouldRenderOnSSR, domFullyLoaded } = getInitialState(
    state,
    props
  )

  return React.Children.toArray(children).map((child, index) => (
    <Slide
      key={index}
      data-index={index}
      aria-hidden={getIfSlideIsVisbile(index, state) ? 'false' : 'true'}
      width={itemWidth}
      basis={flexBasis}
      domFullyLoaded={domFullyLoaded}
      shouldRenderOnSSR={shouldRenderOnSSR}
      className={itemClass}
    >
      {child}
    </Slide>
  ))
}

export default SlideList