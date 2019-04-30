import * as React from 'react'

import { SliderInternalState, SliderProps, stateCallBack } from './types'
import { getOriginalCounterPart, getCloneCounterPart } from './utils/index'
import { StyledDotList, StyledDot } from './Styled'

interface DotsTypes {
  props: SliderProps
  state: SliderInternalState
  goToSlide: (index: number) => void
  getState: () => stateCallBack
}

/**
 * Slider Dots
 */
const Dots = ({
  props,
  state,
  goToSlide,
  getState,
}: DotsTypes): React.ReactElement<any> | null => {
  const { showDots, customDot, dotListClass, infinite, children } = props
  if (!showDots) {
    return null
  }
  const { currentSlide } = state
  const childrenArr = React.Children.toArray(children)
  return (
    <StyledDotList className={dotListClass}>
      {Array(childrenArr.length)
        .fill(0)
        .map((item, index: number) => {
          const slideIndex = infinite
            ? getOriginalCounterPart(index, state, childrenArr)
            : index
          const cloneIndex = infinite
            ? getCloneCounterPart(index, state, childrenArr)
            : null
          let isActive
          if (cloneIndex !== undefined) {
            isActive =
              currentSlide === cloneIndex || currentSlide === slideIndex
          } else {
            isActive = currentSlide === slideIndex
          }
          if (customDot) {
            return React.cloneElement(customDot, {
              index,
              active: isActive,
              onClick: () => goToSlide(slideIndex),
              carouselState: getState(),
            })
          }
          return (
            <li data-index={index} key={index}>
              <StyledDot
                isActive={isActive}
                onClick={() => goToSlide(slideIndex)}
              />
            </li>
          )
        })}
    </StyledDotList>
  )
}

export default Dots
