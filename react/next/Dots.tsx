import React, { useMemo } from 'react'

import { SliderInternalState, SliderProps, stateCallBack } from './types'
import { StyledDotList, StyledDot } from './Styled'

interface DotsProps {
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
}: DotsProps): React.ReactElement<any> | null => {
  const { slidesToShow, totalItems, currentSlide, domLoaded } = state
  const { showDots, customDot, dotListClass, slideVisibleSlides } = props

  const slideIndexes = useMemo(
    () =>
      slidesToShow
        ? [
            ...Array(
              slideVisibleSlides
                ? Math.ceil(totalItems / slidesToShow)
                : totalItems
            ).keys(),
          ]
        : [],
    [slidesToShow]
  )

  const selectedDot = useMemo(() => {
    const realCurrentSlide = slideVisibleSlides
      ? currentSlide + (slidesToShow - 1)
      : currentSlide
    return slideVisibleSlides
      ? Math.floor(realCurrentSlide / slidesToShow)
      : realCurrentSlide
  }, [currentSlide, domLoaded])

  const handleDotClick = (index: number) => {
    const slideToGo = slideVisibleSlides ? index * slidesToShow : index

    const isLastDot = index === slideIndexes.length - 1
    const isExactDivision = totalItems % slidesToShow === 0
    const overslideThreshold =
      !isExactDivision && isLastDot ? Math.floor(totalItems / slidesToShow) : 0

    goToSlide(slideToGo - overslideThreshold)
  }

  if (!showDots) {
    return null
  }

  return (
    <StyledDotList className={dotListClass}>
      {slideIndexes.map(index => {
        return (
          <StyledDot
            key={index}
            isActive={index === selectedDot}
            onClick={() => handleDotClick(index)}
          />
        )
      })}
    </StyledDotList>
  )
}

export default Dots
