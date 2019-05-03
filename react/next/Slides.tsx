import React from 'react'

import { SliderInternalState, SliderProps } from './types'
import { getInitialState, getIfSlideIsVisbile } from './utils/index'
import { StyledSlide } from './Styled'

interface SlidesProps {
  props: SliderProps
  state: SliderInternalState
}

const Slides = ({ props, state }: SlidesProps): any => {
  const { itemWidth } = state
  const { children, itemClass } = props
  const { flexBasis, shouldRenderOnSSR, domFullyLoaded } = getInitialState(
    state,
    props
  )

  return React.Children.toArray(children).map((child, index) => (
    <StyledSlide
      key={index}
      data-index={index}
      aria-hidden={getIfSlideIsVisbile(index, state) ? 'false' : 'true'}
      width={itemWidth}
      basis={flexBasis}
      domFullyLoaded={domFullyLoaded}
      shouldRenderOnSSR={shouldRenderOnSSR}
      className={`${itemClass} relative`}
    >
      {child}
    </StyledSlide>
  ))
}

export default Slides
