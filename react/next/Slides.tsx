import React, { FC } from 'react'

import { SliderInternalState, SliderProps } from './types'
import { getInitialState, getIfSlideIsVisbile } from './utils/index'
import { StyledSlide } from './Styled'

interface SlidesProps {
  props: SliderProps
  state: SliderInternalState
}

const Slides = ({ props, state }: SlidesProps): any => {
  const { itemWidth } = state
  const { children, itemClass, partialVisbile } = props
  const {
    flexBisis,
    shouldRenderOnSSR,
    domFullyLoaded,
    paritialVisibilityGutter,
  } = getInitialState(state, props)

  return React.Children.toArray(children).map((child, index) => (
    <StyledSlide
      key={index}
      data-index={index}
      aria-hidden={getIfSlideIsVisbile(index, state) ? 'false' : 'true'}
      width={
        domFullyLoaded
          ? `${
              partialVisbile && paritialVisibilityGutter
                ? itemWidth - paritialVisibilityGutter
                : itemWidth
            }px`
          : 'auto'
      }
      flex={shouldRenderOnSSR ? `1 0 ${flexBisis}%` : 'auto'}
      position="relative"
      className={itemClass}
    >
      {child}
    </StyledSlide>
  ))
}

export default Slides
