import React from 'react'

import { SliderState, SliderProps } from './typings'
import { getInitialState, getIfSlideIsVisbile } from './utils/index'
import { StyledSlide } from './Styled'

interface Props {
  props: SliderProps
  state: SliderState
}

const Slides = ({ props, state }: Props): any => {
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
      className={itemClass}
    >
      {child}
    </StyledSlide>
  ))
}

export default Slides
